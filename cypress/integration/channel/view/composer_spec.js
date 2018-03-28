import data from '../../../../shared/testing/data';
import constants from '../../../../api/migrations/seed/default/constants';

const channel = data.channels[0];

const community = data.communities.find(
  community => community.id === channel.communityId
);

const { userId: memberInChannelId } = data.usersChannels.find(
  ({ channelId, isMember, isOwner }) => channelId === channel.id && isMember
);

const QUIET_USER_ID = constants.QUIET_USER_ID;

describe('renders composer for logged in members', () => {
  before(() => {
    cy.auth(memberInChannelId);
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should render composer', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy.get('[data-cy="thread-composer-placeholder"]').should('be.visible');

    cy.get('[data-cy="thread-composer-placeholder"]').click();

    cy.get('[data-cy="thread-composer"]').should('be.visible');
  });
});

describe('does not render composer for non members', () => {
  before(() => {
    cy.auth(QUIET_USER_ID);
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should not render composer', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy.get('[data-cy="thread-composer-placeholder"]').should('not.be.visible');
  });
});

describe('does not render composer for logged out users', () => {
  before(() => {
    cy.visit(`/${community.slug}/${channel.slug}`);
  });

  it('should not render composer', () => {
    cy.get('[data-cy="channel-view"]').should('be.visible');

    cy.get('[data-cy="thread-composer-placeholder"]').should('not.be.visible');
  });
});