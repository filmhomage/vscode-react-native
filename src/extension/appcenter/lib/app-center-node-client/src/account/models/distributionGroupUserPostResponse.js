/*
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

/**
 * Class representing a DistributionGroupUserPostResponse.
 */
class DistributionGroupUserPostResponse {
  /**
   * Create a DistributionGroupUserPostResponse.
   * @member {string} [code] The code of the result
   * @member {boolean} [invitePending] Whether the has accepted the invite.
   * Available when an invite is pending, and the value will be "true".
   * @member {number} [message] The message of the result
   * @member {number} status The status code of the result
   * @member {string} [userEmail] The email of the user
   */
  constructor() {
  }

  /**
   * Defines the metadata of DistributionGroupUserPostResponse
   *
   * @returns {object} metadata of DistributionGroupUserPostResponse
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'DistributionGroupUserPostResponse',
      type: {
        name: 'Composite',
        className: 'DistributionGroupUserPostResponse',
        modelProperties: {
          code: {
            required: false,
            serializedName: 'code',
            type: {
              name: 'String'
            }
          },
          invitePending: {
            required: false,
            serializedName: 'invite_pending',
            type: {
              name: 'Boolean'
            }
          },
          message: {
            required: false,
            serializedName: 'message',
            type: {
              name: 'Number'
            }
          },
          status: {
            required: true,
            serializedName: 'status',
            type: {
              name: 'Number'
            }
          },
          userEmail: {
            required: false,
            serializedName: 'user_email',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = DistributionGroupUserPostResponse;
