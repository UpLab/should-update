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

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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
 * @returns true because firstName and lastName have changed
 *
 *
 * @param  {object} params
 * @param  {array} params.dependencies - array of pathes of the properties to depend on
 * @param  {object} params.props - component props
 * @param  {object} params.nextProps - component changed props. Can be previous or next props
 * @param  {boolean} [params.shallow] - if `true` then the function will do shallow comparison.
 *
 * @return {boolean} - Returns `true` if the component should update, else `false`.
 */

function shouldUpdate(_ref) {
  var _ref$dependencies = _ref.dependencies,
      dependencies = _ref$dependencies === undefined ? [] : _ref$dependencies,
      props = _ref.props,
      nextProps = _ref.nextProps,
      shallow = _ref.shallow;

  for (var i = 0; i < dependencies.length; i += 1) {
    var path = dependencies[i];
    var valueA = (0, _lodash2['default'])(props, path);
    var valueB = (0, _lodash2['default'])(nextProps, path);

    var changed = shallow ? valueA !== valueB : !(0, _lodash4['default'])(valueA, valueB);
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
 * @param  {object} params
 * @param  {array} params.dependencies - array of pathes of the properties to depend on
 * @param  {boolean} [params.shallow] - if `true` then the function will do shallow comparison.
 *
 * @return {function} - shouldComponentUpdate implementation
 */

function createShouldUpdate(_ref2) {
  var dependencies = _ref2.dependencies,
      shallow = _ref2.shallow,
      options = _objectWithoutProperties(_ref2, ['dependencies', 'shallow']);

  return function () {
    function shouldComponentUpdate(nextProps) {
      return shouldUpdate(Object.assign({ dependencies: dependencies }, options, { props: this.props, nextProps: nextProps }));
    }

    return shouldComponentUpdate;
  }();
}
