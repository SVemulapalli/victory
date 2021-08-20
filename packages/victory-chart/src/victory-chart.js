import { defaults, assign, isEmpty } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import {
  Background,
  Helpers,
  VictoryContainer,
  VictoryTheme,
  CommonProps,
  PropTypes as CustomPropTypes,
  Wrapper,
  usePreviousProps,
  useAnimationState
} from "victory-core";
import { VictorySharedEvents } from "victory-shared-events";
import { VictoryAxis } from "victory-axis";
import { VictoryPolarAxis } from "victory-polar-axis";
import {
  getBackgroundWithProps,
  getChildComponents,
  getCalculatedProps,
  getChildren
} from "./helper-methods";
import isEqual from "react-fast-compare";

const fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};

const VictoryChart = (initialProps) => {
  const role = "chart";
  const { getAnimationProps, setState, setAnimationState, getProps } =
    useAnimationState();
  const props = getProps(initialProps);

  const modifiedProps = Helpers.modifyProps(props, fallbackProps, role);
  const {
    eventKey,
    containerComponent,
    standalone,
    groupComponent,
    externalEventMutations,
    width,
    height,
    theme,
    polar,
    name
  } = modifiedProps;

  const axes = props.polar
    ? modifiedProps.defaultPolarAxes
    : modifiedProps.defaultAxes;

  const childComponents = React.useMemo(
    () => getChildComponents(modifiedProps, axes),
    [modifiedProps, axes]
  );

  const calculatedProps = React.useMemo(
    () => getCalculatedProps(modifiedProps, childComponents),
    [modifiedProps, childComponents]
  );
  const { domain, scale, style, origin, radius, horizontal } = calculatedProps;

  const newChildren = React.useMemo(() => {
    const children = getChildren(props, childComponents, calculatedProps);

    const mappedChildren = children.map((child, index) => {
      const childProps = assign(
        { animate: getAnimationProps(props, child, index) },
        child.props
      );
      return React.cloneElement(child, childProps);
    });

    if (props.style && props.style.background) {
      const backgroundComponent = getBackgroundWithProps(
        props,
        calculatedProps
      );

      mappedChildren.unshift(backgroundComponent);
    }

    return mappedChildren;
  }, [getAnimationProps, childComponents, props, calculatedProps]);

  const containerProps = React.useMemo(() => {
    if (standalone) {
      return {
        domain,
        scale,
        width,
        height,
        standalone,
        theme,
        style: style.parent,
        horizontal,
        name,
        polar,
        radius,
        origin: polar ? origin : undefined
      };
    }
    return {};
  }, [
    domain,
    scale,
    width,
    height,
    standalone,
    theme,
    style,
    horizontal,
    name,
    polar,
    radius,
    origin
  ]);

  const container = React.useMemo(() => {
    if (standalone) {
      const defaultContainerProps = defaults(
        {},
        containerComponent.props,
        containerProps
      );
      return React.cloneElement(containerComponent, defaultContainerProps);
    }
    return groupComponent;
  }, [groupComponent, standalone, containerComponent, containerProps]);

  const events = React.useMemo(() => {
    return Wrapper.getAllEvents(props);
  }, [props]);

  // usePreviousProps is always returning {}
  // setAnimationState is returning because props.animate is undefined
  const previousProps = usePreviousProps(initialProps);

  React.useEffect(() => {
    if (initialProps.animate) {
      setState({
        nodesShouldLoad: false,
        nodesDoneLoad: false,
        animating: true
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (initialProps.animate) {
      setAnimationState(previousProps, initialProps);
    }
  }, [setAnimationState, previousProps, initialProps]);

  if (!isEmpty(events)) {
    return (
      <VictorySharedEvents
        container={container}
        eventKey={eventKey}
        events={events}
        externalEventMutations={externalEventMutations}
      >
        {newChildren}
      </VictorySharedEvents>
    );
  }
  return React.cloneElement(container, container.props, newChildren);
};

VictoryChart.propTypes = {
  ...CommonProps.baseProps,
  backgroundComponent: PropTypes.element,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  defaultAxes: PropTypes.shape({
    independent: PropTypes.element,
    dependent: PropTypes.element
  }),
  defaultPolarAxes: PropTypes.shape({
    independent: PropTypes.element,
    dependent: PropTypes.element
  }),
  endAngle: PropTypes.number,
  innerRadius: CustomPropTypes.nonNegative,
  prependDefaultAxes: PropTypes.bool,
  startAngle: PropTypes.number
};

VictoryChart.defaultProps = {
  backgroundComponent: <Background />,
  containerComponent: <VictoryContainer />,
  defaultAxes: {
    independent: <VictoryAxis />,
    dependent: <VictoryAxis dependentAxis />
  },
  defaultPolarAxes: {
    independent: <VictoryPolarAxis />,
    dependent: <VictoryPolarAxis dependentAxis />
  },
  groupComponent: <g />,
  standalone: true,
  theme: VictoryTheme.grayscale
};

const VictoryChartMemo = React.memo(VictoryChart, isEqual);

VictoryChartMemo.displayName = "VictoryChart";
VictoryChartMemo.expectedComponents = ["groupComponent", "containerComponent"];

export default VictoryChartMemo;
