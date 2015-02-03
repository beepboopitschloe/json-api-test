/**
 * endpoints.js
 *
 * Exports endpoint definitions for the server.
 */

exports = module.exports = {
  implementationRoot: process.cwd() + '/server/impl/',

  routes: [{

    /**
     * /user endpoints
     *
     * @type {String}
     */
    url: '/user',
    model: 'User',
    description: 'Route to get a filtered list of users or create a new one.',

    methods: [{
      method: 'GET',
      description: 'Get a filtered list of users.'
    },{
      method: 'POST',
      description: 'Create a new user.'
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

  /**
   * /team endpoints
   */
  },{
    url: '/team',
    model: 'Team',
    description: 'Route to get and create teams of users.',
    methods: [{
      method: 'GET',
      description: 'Filter the list of all teams.'
    },{
      method: 'POST',
      description: 'Create a new team.'
    }]
  },{
    url: '/team/:teamId',
    model: 'Team',
    description: 'Route to fetch and update specific teams.',
    urlParams: [{
      name: 'teamId',
      type: 'string',
      description: 'The ID of the team to fetch or update.'
    }],
    methods: [{
      method: 'GET',
      description: 'Get a single team.'
    },{
      method: 'PUT',
      description: 'Update a team.'
    }]
  },{
    url: '/team/:teamId/member',
    model: 'Team',
    description: 'Route to fetch and update the list of users in a team.',
    urlParams: [{
      name: 'teamId',
      type: 'string',
      description: 'The ID of the team to check.'
    }],

    /**
     * references
     *
     * Similar to joins. Informs the generator that we are using information 
     * from a different model than the one specified for the route.
     */
    references: [{
      // the model to reference
      model: 'User',

      // optional alias to refer to this reference. defaults to the name of the
      // model
      as: 'members',

      // the field in the referenced model which we are indexing by. defaults to
      // _id
      referenceBy: 'teamId',

      // source of the reference
      source: {
        // the model we're using for the reference. Defaults to the model for
        // the route, but can be a previous reference as well.
        model: 'Team',

        // the field we are using for the reference. can be a string or number
        // for a single value return, or an array for multi-value return.
        field: '_id'
      }
    }],

    /**
     * manipulates
     *
     * Specifies the reference we are concerned with fetching, creating, or
     * editing.
     */
    manipulates: 'members',

    // methods
    methods: [{
      method: 'GET',
      description: 'Get the list of users.'
    },{
      method: 'POST',
      description: 'Add a user to the list.'
    }]
  }]
}
