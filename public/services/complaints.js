angular.module('ForChange')
  .factory('Complaints', function($resource) {
    var Complaints = {

      default: $resource('/api/complaints/:cslug', {
        cslug: '@cslug'
      }, {
        update: {
          method: 'PUT',
          params: {
            cslug: '@cslug'
          }
        }
      }),

      status: $resource('/api/complaints/:cslug/status', {
        cslug: '@cslug'
      }, {
        update: {
          method: 'PUT',
          params: {
            cslug: '@cslug'
          }
        }
      }),

      upvote: $resource('/api/complaints/:cslug', {
        cslug: '@cslug'
      }, {
        update: {
          method: 'PUT',
          params: {
            cslug: '@cslug'
          },
          url: '/api/complaints/:cslug/upvote'
        }
      }),
      
      comment: $resource('/api/complaints/:cslug', {
        cslug: '@cslug'
      }, {
        save: {
          method: 'POST',
          params: {
            cslug: '@cslug'
          },
          url: '/api/complaints/:cslug/comment'
        }
      }),
      
      follow: $resource('/api/complaints/:cslug', {
        cslug: '@cslug'
      }, {
        update: {
          method: 'PUT',
          params: {
            cslug: '@cslug'
          },
          url: '/api/complaints/:cslug/follow'
        }
      }),
      
      log: $resource('/api/complaints/:cslug/log', {
        cslug: '@cslug'
      }),
      
      makeAnon: $resource('/api/complaints/:cslug/anonymous', {
        cslug: '@cslug'
      }, {
        update: {
          method: 'PUT',
          params: {
            cslug: '@cslug'
          }
        }
      }),
      makeFeatured: $resource('/api/complaints/:cslug/featured', {
        cslug: '@cslug'
      }, {
        update: {
          method: 'PUT',
          params: {
            cslug: '@cslug'
          }
        }
      })
    };
  
    return Complaints;
  });