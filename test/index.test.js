
import cloneDeep from 'lodash.clonedeep';
import { shouldUpdate, createShouldUpdate } from '../src';

class TestComponent {
  constructor(props, state) {
    this.props = props;
    this.state = state;
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
    it('returns false if no props changed', () => {
      expect(shouldUpdate({
        dependencies: ['user.profile'],
        props: { user: { ...firstUser } },
        nextProps: { user: { ...firstUser } },
      })).toBe(false);
    });

    it('returns false if no props changed ({ shallow: true })', () => {
      expect(shouldUpdate({
        dependencies: ['user.profile'],
        props: { user: firstUser },
        nextProps: { user: firstUser },
        shallow: true,
      })).toBe(false);
    });

    it('returns false if no state changed', () => {
      expect(shouldUpdate({
        stateDependencies: ['user.profile'],
        state: { user: firstUser },
        nextState: { user: firstUser },
        shallow: true,
      })).toBe(false);
    });

    it('returns false if no state changed ({ shallow: true })', () => {
      expect(shouldUpdate({
        stateDependencies: ['user.profile'],
        state: { user: firstUser },
        nextState: { user: firstUser },
        shallow: true,
      })).toBe(false);
    });

    it('returns false if neither state nor props changed', () => {
      expect(shouldUpdate({
        stateDependencies: ['user.profile'],
        state: { user: firstUser },
        nextState: { user: firstUser },
        dependencies: ['user.profile'],
        props: { user: firstUser },
        nextProps: { user: firstUser },
        shallow: true,
      })).toBe(false);
    });

    it("returns false if changes were made deeper, but reference-type dependency didn't change ({shallow: true})", () => {
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

    it('returns true if props changed', () => {
      expect(shouldUpdate({
        dependencies: ['user.profile'],
        props: { user: { ...firstUser } },
        nextProps: { user: { ...secondUser } },
      })).toBe(true);
    });

    it('returns true if props changed ({ shallow: true })', () => {
      expect(shouldUpdate({
        dependencies: ['user.profile'],
        props: { user: { ...firstUser } },
        nextProps: { user: { ...secondUser } },
        shallow: true,
      })).toBe(true);
    });

    it('returns true if state changed', () => {
      expect(shouldUpdate({
        stateDependencies: ['user.profile'],
        state: { user: { ...firstUser } },
        nextState: { user: { ...secondUser } },
      })).toBe(true);
    });

    it('returns true if state changed ({ shallow: true })', () => {
      expect(shouldUpdate({
        stateDependencies: ['user.profile'],
        state: { user: { ...firstUser } },
        nextState: { user: { ...secondUser } },
        shallow: true,
      })).toBe(true);
    });

    it('returns true if state and props changed', () => {
      expect(shouldUpdate({
        dependencies: ['user.profile'],
        props: { user: { ...firstUser } },
        nextProps: { user: { ...secondUser } },
        stateDependencies: ['user.profile'],
        state: { user: { ...firstUser } },
        nextState: { user: { ...secondUser } },
      })).toBe(true);
    });
  });

  describe('createShouldUpdate()', () => {
    it('creates a simple shouldComponentUpdate function (props)', () => {
      const state = {
        form: {
          isActive: false,
          notes: '',
        },
      };

      const mock = new TestComponent({
        user: firstUser,
      }, {
        ...cloneDeep(state),
      });

      mock.shouldComponentUpdate = createShouldUpdate({
        dependencies: ['user.profile.firstName', 'user.profile.lastName'],
        stateDependencies: ['form.isActive'],
      });

      it('returns true if props changed', () => {
        expect(mock.shouldComponentUpdate({
          user: secondUser,
        }, cloneDeep(state))).toBe(true);
      });

      it('returns false if no props or state changed', () => {
        expect(mock.shouldComponentUpdate({
          user: firstUser,
        }, cloneDeep(state))).toBe(false);
      });

      it('returns true if state changed', () => {
        const newState = cloneDeep(state);
        newState.form.isActive = true;

        expect(mock.shouldComponentUpdate({
          user: firstUser,
        }, newState)).toBe(true);
      });

      it('returns false if only not dependent props changed', () => {
        expect(mock.shouldComponentUpdate({
          user: {
            ...firstUser,
            // id is changed but it is not a dependency
            id: 'some-id-2',
          },
        }, state)).toBe(false);
      });
    });
  });
});
