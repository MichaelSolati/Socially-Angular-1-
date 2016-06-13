import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './partiesList.html';
import { Parties } from '../../collections/parties/index';
import { name as PartiesSort } from '../partiesSort/partiesSort.component';
import { name as PartiesMap } from '../partiesMap/partiesMap.component';
import { name as PartyAdd } from '../partyAdd/partyAdd.component';
import { name as PartyRemove } from '../partyRemove/partyRemove.component';
import { name as PartyRsvp } from '../partyRsvp/partyRsvp.component';
import { name as PartyRsvpsList } from '../partyRsvpsList/partyRsvpsList.component';
import { name as PartyUnanswered } from '../partyUnanswered/partyUnanswered.component';
import { name as PartyCreator } from '../partyCreator/partyCreator.component';

class PartiesList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';

    this.subscribe('parties', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }, this.getReactively('searchText')]);
    this.subscribe('users');

    this.helpers({
      parties() {
        return Parties.find({}, {
          sort : this.getReactively('sort')
        });
      },
      partiesCount() {
        return Counts.get('numberOfParties');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      }
    });
  }

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}

const name = 'partiesList';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  PartiesSort,
  PartiesMap,
  PartyAdd,
  PartyRemove,
  PartyRsvp,
  PartyRsvpsList,
  PartyCreator
]).component(name, {
  template,
  controllerAs: name,
  controller: PartiesList
}).config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
  .state('parties', {
    url: '/parties',
    template: '<parties-list></parties-list>'
  });
}