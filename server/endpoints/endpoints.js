/**
 * endpoints.js
 *
 * Exports endpoint definitions for the server.
 */

exports = module.exports = {
  implementationRoot: process.cwd() + '/server/impl/',

  routes: [{
    url: '/user',
    model: 'User',
    description: 'Route to get a filtered list of users or create a new one.',

    methods: [{
      method: 'GET',
      description: 'Get a filtered list of users.'
    },{
      method: 'POST',
      description: 'Create a new user.'
    },{
      method: 'PUT',
      description: 'Update an existing user.'
    }]
  },{
    url: '/user/:userId',
    model: 'User',
    urlParams: [{
      name: 'userId',
      type: 'string',
      description: 'The ID of the user to fetch or update.',
      
      /**
       * mapsToField
       *
       * Optional parameter which informs the handler what database field it
       * should look for when finding an object. Defaults to _id.
       * 
       * Example: f mapsToField is 'username', then the handler will execute a
       * find operation like this:
       * 
       * Model.find({
       *   username: urlParamValue
       * }, ...);
       */
      mapsToField: '_id'
    }],
    methods: [{
      method: 'GET',
      description: 'Get a single user by ID.'
    },{
      method: 'PUT',
      description: 'Update a user by ID.'
    },{
      method: 'DELETE',
      description: 'Delete a user by ID.'
    }]
  },{
    url: '/team',
    model: 'Team',
    description: 'Route to get and create teams of users.'
  }]
}
