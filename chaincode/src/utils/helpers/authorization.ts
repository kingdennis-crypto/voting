import { ClientIdentity } from 'fabric-shim-api'

/**
 * Utility class for authorization related operations
 */
export default class AuthorizationHelper {
  /**
   * Checks if the provided identity represents an administrator.
   * @param {ClientIdentity} identity - The identity object
   * @returns {boolean} True if the identity is an administrator, false otherwise
   */
  public static isAdmin(identity: ClientIdentity): boolean {
    var match = identity.getID().match('.*CN=(.*)::')
    return match !== null && match[1] === 'admin'
  }

  /**
   * Checks if the provided identity has the role of a voter.
   * @param {ClientIdentity} identity - The identity object.
   * @returns {boolean} True if the identity has the role of a voter, false otherwise.
   */
  public static isVoter(identity: ClientIdentity): boolean {
    return identity.assertAttributeValue('role', 'voter')
  }

  /**
   * Retrieves the participant ID associated with the provided identity
   * @param {ClientIdentity} identity - The identity object
   * @returns {string} The participant ID.
   */
  public static getParticipantId(identity: ClientIdentity): string {
    return identity.getAttributeValue('id')
  }
}
