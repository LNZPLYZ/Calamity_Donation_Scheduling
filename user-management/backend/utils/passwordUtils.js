const { promisify } = require('util')
const { randomBytes, scrypt, timingSafeEqual } = require('crypto')

const scryptAsync = promisify(scrypt)
const SCRYPT_COST = 16384
const SCRYPT_BLOCK_SIZE = 8
const SCRYPT_PARALLELIZATION = 1
const SALT_LENGTH = 16
const KEY_LENGTH = 64

// Convert a password into a salted hash that can be stored in User.password_hash.
const hashPassword = async (password) => {
    const salt = randomBytes(SALT_LENGTH)
    const key = await scryptAsync(password, salt, KEY_LENGTH, {
        N: SCRYPT_COST,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELIZATION,
    })

    return [
        'scrypt',
        SCRYPT_COST,
        SCRYPT_BLOCK_SIZE,
        SCRYPT_PARALLELIZATION,
        salt.toString('base64url'),
        key.toString('base64url'),
    ].join('$')
}

// Verify only hashes written in the format produced above.
const verifyPassword = async (password, storedHash) => {
    if (typeof storedHash !== 'string') {
        return false
    }

    const [algorithm, cost, blockSize, parallelization, saltText, keyText, extra] =
        storedHash.split('$')

    if (
        algorithm !== 'scrypt' ||
        cost !== String(SCRYPT_COST) ||
        blockSize !== String(SCRYPT_BLOCK_SIZE) ||
        parallelization !== String(SCRYPT_PARALLELIZATION) ||
        !saltText ||
        !keyText ||
        extra !== undefined ||
        !/^[A-Za-z0-9_-]+$/.test(saltText) ||
        !/^[A-Za-z0-9_-]+$/.test(keyText)
    ) {
        return false
    }

    const salt = Buffer.from(saltText, 'base64url')
    const expectedKey = Buffer.from(keyText, 'base64url')

    if (
        salt.length !== SALT_LENGTH ||
        expectedKey.length !== KEY_LENGTH ||
        salt.toString('base64url') !== saltText ||
        expectedKey.toString('base64url') !== keyText
    ) {
        return false
    }

    const actualKey = await scryptAsync(password, salt, KEY_LENGTH, {
        N: SCRYPT_COST,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELIZATION,
    })

    return timingSafeEqual(actualKey, expectedKey)
}

module.exports = { hashPassword, verifyPassword }
