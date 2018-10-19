/* eslint max-len: 0 */
import get from 'lodash.get';
import isEqual from 'lodash.isequal';

/**
 * @example
 * shouldUpdate({
 *  dependencies: ['user.profile.firstName', 'user.profile.lastName'],
 *  stateDependencies: [jedis],
 *  props: {
 *    user: {
 *      id: 'some-id',
 *      profile: {
 *        firstName: 'Darth',
 *        lastName: 'Vader',
 *      }
 *    }
 *  },
 * state: {
 *  selectedJedi: {
 *    id: 'some-id',
 *      profile: {
 *        firstName: 'Anakin',
 *        lastName: 'Skywalker',
 *     }
 *   }
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
 * nextState {
 *   selectedJedi: {
 *    id: 'some-id',
 *      profile: {
 *        firstName: 'Obi-Wan',
 *        lastName: 'Kenobi',
 *      }
 *   }
 *  },
 * });
 *
 * @returns true because data have changed
 *
 *
 * @param  {object} params
 * @param  {array} params.dependencies - array of pathes of the properties to depend on
 * @param  {array} params.stateDependencies - array of pathes of the properties to depend on
 * @param  {object} params.props - component props
 * @param  {object} params.state - component state
 * @param  {object} params.nextProps - component changed props. Can be previous or next props
 * @param  {object} params.nextState - component changed state. Can be previous or next state
 * @param  {boolean} [params.shallow] - if `true` then the function will do shallow comparison.
 *
 * @return {boolean} - Returns `true` if the component should update, else `false`.
 */

export function shouldUpdate(params) {
  const {
    dependencies = [],
    props,
    nextProps,
    shallow,
    state,
    nextState,
    stateDependencies = [],
  } = params;
  for (let i = 0; i < dependencies.length; i += 1) {
    const path = dependencies[i];
    const valueA = get(props, path);
    const valueB = get(nextProps, path);

    const changed = shallow ? valueA !== valueB : !isEqual(valueA, valueB);
    if (changed) {
      return true;
    }
  }

  for (let i = 0; i < stateDependencies.length; i += 1) {
    const path = stateDependencies[i];
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
 *     stateDependencies: ['user'],
 *     dependencies: ['user'],
 *     shallow: false,
 *  })
 * }
 *
 *
 * @param  {object} params
 * @param  {array} params.dependencies - array of pathes of the properties to depend on
 * @param  {array} params.stateDependencies - array of pathes of the properties to depend on
 * @param  {boolean} [params.shallow] - if `true` then the function will do shallow comparison.
 *
 * @return {function} - shouldComponentUpdate implementation
 */

export function createShouldUpdate({ dependencies, stateDependencies, shallow, ...options }) {
  return function shouldComponentUpdate(nextProps, nextState) {
    return shouldUpdate({
      dependencies,
      ...options,
      props: this.props,
      nextProps,
      state: this.state,
      stateDependencies,
      nextState,
    });
  };
}
