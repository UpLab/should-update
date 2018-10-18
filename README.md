## Install
```
npm i --save @uplab/should-update
```

## Intro

There is a time when a React Developer evolves to a Good React developer and 
decides to add shouldComponentUpdate to every component that cannot be PureComponent.
In most cases ones `shouldComponentUpdate` function implementation looks similar to this:

```
class DeathStar extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.jedi.id !== nextProps.jedi.id ||
      this.props.jedi.name !== nextProps.jedi.name ||
      this.props.jedi.profile.firstName !== nextProps.jedi.profile.lastName
      // ... forevermore 
    );
  }
}
```

## Solution

This package is made to simplify the API for props and state comparison to a single function call.
`@uplab/should-update` can deal with nested properties and accepts an array on dependencies that are 
presented as a path string (i.e. `some.very.deeply.nested.data.and.even.array[0].items`).

**Example usage**:

```javascript
import { createShouldUpdate } from 'should-update';

class DeathStar extends Component {
  shouldComponentUpdate: createShouldUpdate({ dependencies: ['jedi.id', 'jedi.name', 'jedi.profile.firstName'] })
}
```

or

```javascript
import { shouldUpdate } from 'should-update';

class DeathStar extends Component {
  shouldComponentUpdate(nextProps) {
    const propsChanged = shouldUpdate({
      dependencies: ['jedi.id', 'jedi.name', 'jedi.profile.firstName'],
      props: this.props,
      nextProps,
    });
    // some custom stuff with propsChanged
  }
}
```

By default, if the resolved path is a type of object, then the deep comparison happens to check all the nested props.
To avoid this behavior when you have complex and huge objects you can pass `shallow: true` prop:

```javascript
shouldComponentUpdate: createShouldUpdate({ dependencies: ['jedi.profile'], shallow: true })
```

or

```javascript
shouldUpdate({
  dependencies: ['jedi.profile'],
  props: this.props,
  nextProps,
  shallow: true, //defaults to false
});
```

## API
### `shouldUpdate(params)`

- @param {array} params.dependencies - array of pathes of the properties to depend on
- @param {object} params.props - component props
- @param {object} params.nextProps - component changed props. Can be previous or next props
- @param {boolean} [params.shallow] - if `true` then the function will do shallow comparison.

Returns `true` if the component should update, else `false`.

### `createShouldUpdate(params)`

Same as `shouldUpdate`, but without `params.props` and `params.nextProps`
