/* eslint max-len: 0 */
import get from 'lodash.get';
import isEqual from 'lodash.isequal';

/**
 * @example
 * shouldUpdate({
 *  dependencies: ['user.profile.firstName', 'user.profile.lastName'],
 *  props: {
 *    user: {
 *      id: 'some-id',
 *      profile: {
 *        firstName: 'Darth',
 *        lastName: 'Vader',
 *      }
 *    }
 *  },
 *  nextProps {
 *    user: {
 *      id: 'some-id',
 *      profile: {
 *        firstName: 'Anakin',
 *        lastName: 'Skywalker',
 *      }
 *    }
 *  },
 * });
 *
 *  shouldUpdate({
 *  dependenciesState: ['user.profile.firstName', 'user.profile.lastName'],
 *  state: {
 *    user: {
 *      id: 'some-id',
 *      profile: {
 *        firstName: 'Darth',
 *        lastName: 'Vader',
 *      }
 *    }
 *  },
 *  nextState {
 *    user: {
 *      id: 'some-id',
 *      profile: {
 *        firstName: 'Anakin',
 *        lastName: 'Skywalker',
 *      }
 *    }
 *  },
 * });
 * @returns true because firstName and lastName have changed
 *
 *
 * @param  {object} params
 * @param  {array} params.dependencies - array of pathes of the properties to depend on
 * @param  {array} params.dependenciesState - array of pathes of the properties to depend on
 * @param  {object} params.props - component props
 * @param  {object} params.state - component state
 * @param  {object} params.nextProps - component changed props. Can be previous or next props
 * @param  {object} params.nextState - component changed state. Can be previous or next state
 * @param  {boolean} [params.shallow] - if `true` then the function will do shallow comparison.
 *
 * @return {boolean} - Returns `true` if the component should update, else `false`.
 */

export function shouldUpdate({
  dependencies = [],
  props,
  nextProps,
  shallow,
  state,
  nextState,
  dependenciesState = [],
}) {
  for (let i = 0; i < dependencies.length; i += 1) {
    const path = dependencies[i];
    const valueA = get(props, path);
    const valueB = get(nextProps, path);

    const changed = shallow ? valueA !== valueB : !isEqual(valueA, valueB);
    if (changed) {
      return true;
    }
  }

  for (let i = 0; i < dependenciesState.length; i += 1) {
    const path = dependenciesState[i];
    const valueA = get(state, path);
    const valueB = get(nextState, path);

    const changed = shallow ? valueA !== valueB : !isEqual(valueA, valueB);
    if (changed) {
      return true;
    }
  }

  return false;
}


/**
 * @example
 * class MyComponent extends Component {
 *   shouldComponentUpdate: createShouldUpdate({
 *     dependencies: ['user'],
 *     shallow: false,
 *  })
 * }
 *
 * class MyComponent extends Component {
 *   shouldComponentUpdate: createShouldUpdate({
 *     dependenciesState: ['user'],
 *     shallow: false,
 *  })
 * }
 *
 * @param  {object} params
 * @param  {array} params.dependencies - array of pathes of the properties to depend on
 * @param  {array} params.dependenciesState - array of pathes of the properties to depend on
 * @param  {boolean} [params.shallow] - if `true` then the function will do shallow comparison.
 *
 * @return {function} - shouldComponentUpdate implementation
 */

export function createShouldUpdate({ dependencies, dependenciesState, shallow, ...options }) {
  return function shouldComponentUpdate(nextProps, nextState) {
    return shouldUpdate({ dependencies, ...options, props: this.props, nextProps, state: this.state, dependenciesState, nextState });
  };
}
