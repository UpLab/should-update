import cloneDeep from 'lodash.clonedeep';
import { shouldUpdate, createShouldUpdate } from '../src';

class TestComponent {
  constructor(props) {
    this.props = props;
  }
}

const firstUser = {
  id: 'some-id',
  profile: {
    firstName: 'Darth',
    lastName: 'Vader',
  },
};

const secondUser = {
  id: 'some-id-2',
  profile: {
    firstName: 'Anakin',
    lastName: 'Skywalker',
  },
};

describe('should-update', () => {
  describe('shouldUpdate()', () => {
    it('returns false if no changes were made (props)', () => {
      expect(shouldUpdate({
        dependencies: ['user.profile'],
        props: { user: { ...firstUser } },
        nextProps: { user: { ...firstUser } },
      })).toBe(false);
    });

    it('returns false if no changes were made with shallow (props)', () => {
      expect(shouldUpdate({
        dependencies: ['user.profile'],
        props: { user: firstUser },
        nextProps: { user: firstUser },
        shallow: true,
      })).toBe(false);
    });

    it('returns false if no changes were made (state)', () => {
      expect(shouldUpdate({
        dependenciesState: ['user.profile'],
        state: { user: firstUser },
        nextState: { user: firstUser },
        shallow: true,
      })).toBe(false);
    });

    it('returns false if no changes were made with shallow (state)', () => {
      expect(shouldUpdate({
        dependenciesState: ['user.profile'],
        state: { user: firstUser },
        nextState: { user: firstUser },
        shallow: true,
      })).toBe(false);
    });

    it("returns false if changes were made deeper, but reference-type dependency didn't change with shallow", () => {
      const firstUserClone = cloneDeep(firstUser);

      const patchedFirstUser = {
        ...firstUserClone,
      };

      patchedFirstUser.profile.firstName = 'Test';

      expect(shouldUpdate({
        dependencies: ['user.profile'],
        props: { user: firstUserClone },
        nextProps: { user: patchedFirstUser },
        shallow: true,
      })).toBe(false);
    });

    it('returns true if changes were made (props)', () => {
      expect(shouldUpdate({
        dependencies: ['user.profile'],
        props: { user: { ...firstUser } },
        nextProps: { user: { ...secondUser } },
      })).toBe(true);
    });

    it('returns true if changes were made with shallow (props)', () => {
      expect(shouldUpdate({
        dependencies: ['user.profile'],
        props: { user: { ...firstUser } },
        nextProps: { user: { ...secondUser } },
        shallow: true,
      })).toBe(true);
    });

    it('returns true if changes were made (state)', () => {
      expect(shouldUpdate({
        dependenciesState: ['user.profile'],
        state: { user: { ...firstUser } },
        nextState: { user: { ...secondUser } },
      })).toBe(true);
    });

    it('returns true if changes were made with shallow (state)', () => {
      expect(shouldUpdate({
        dependenciesState: ['user.profile'],
        state: { user: { ...firstUser } },
        nextState: { user: { ...secondUser } },
        shallow: true,
      })).toBe(true);
    });
  });

  describe('createShouldUpdate()', () => {
    it('creates a simple shouldComponentUpdate function', () => {
      const mock = new TestComponent({
        user: firstUser,
      });
      mock.shouldComponentUpdate = createShouldUpdate({ dependencies: ['user.profile.firstName', 'user.profile.lastName'] });

      expect(mock.shouldComponentUpdate({
        user: secondUser,
      })).toBe(true);

      expect(mock.shouldComponentUpdate({
        user: {
          ...firstUser,
          // id is changed but it is not a dependency
          id: 'some-id-2',
        },
      })).toBe(false);
    });
  });
});
