'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldUpdate = shouldUpdate;
exports.createShouldUpdate = createShouldUpdate;

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isequal');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* eslint max-len: 0 */


/**
 * @example
 * shouldUpdate({
 *  dependencies: ['user.profile.firstName', 'user.profile.lastName'],
 *  stateDependencies: ['formState'],
 *  props: {
 *    user: {
 *      id: 'some-id',
 *      profile: {
 *        firstName: 'Darth',
 *        lastName: 'Vader',
 *      }
 *    }
 *  },
 *  state: {
 *    formState: {
 *      firstName: 'Anakin',
 *      lastName: 'Skywalker',
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
 *  nextState {
 *    formState: {
 *      firstName: 'Anakin',
 *      lastName: 'Skywalker',
 *    }
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

function shouldUpdate(params) {
  var _params$dependencies = params.dependencies,
      dependencies = _params$dependencies === undefined ? [] : _params$dependencies,
      props = params.props,
      nextProps = params.nextProps,
      shallow = params.shallow,
      state = params.state,
      nextState = params.nextState,
      _params$stateDependen = params.stateDependencies,
      stateDependencies = _params$stateDependen === undefined ? [] : _params$stateDependen;

  for (var i = 0; i < dependencies.length; i += 1) {
    var path = dependencies[i];
    var valueA = (0, _lodash2['default'])(props, path);
    var valueB = (0, _lodash2['default'])(nextProps, path);

    var changed = shallow ? valueA !== valueB : !(0, _lodash4['default'])(valueA, valueB);
    if (changed) {
      return true;
    }
  }

  for (var _i = 0; _i < stateDependencies.length; _i += 1) {
    var _path = stateDependencies[_i];
    var _valueA = (0, _lodash2['default'])(state, _path);
    var _valueB = (0, _lodash2['default'])(nextState, _path);

    var _changed = shallow ? _valueA !== _valueB : !(0, _lodash4['default'])(_valueA, _valueB);
    if (_changed) {
      return true;
    }
  }

  return false;
}

/**
 * @example
 * class MyComponent extends Component {
 *   shouldComponentUpdate: createShouldUpdate({
 *     stateDependencies: ['formState'],
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

function createShouldUpdate(_ref) {
  var dependencies = _ref.dependencies,
      stateDependencies = _ref.stateDependencies,
      shallow = _ref.shallow,
      options = _objectWithoutProperties(_ref, ['dependencies', 'stateDependencies', 'shallow']);

  return function () {
    function shouldComponentUpdate(nextProps, nextState) {
      return shouldUpdate(Object.assign({
        dependencies: dependencies
      }, options, {
        props: this.props,
        nextProps: nextProps,
        state: this.state,
        stateDependencies: stateDependencies,
        nextState: nextState
      }));
    }

    return shouldComponentUpdate;
  }();
}
