import { TWO_DAYS } from "~/constants/time"
import { MOSTRO_PUB_KEY } from '~/constants/mostro'
import type { UnsignedEvent, Event, } from "nostr-tools"
import useNip44 from '~/composables/useNip44'
import { getPublicKey, getEventHash, finalizeEvent, generateSecretKey } from "nostr-tools"

type Rumor = UnsignedEvent & { id: string }


// Test case using the above example
// const senderPrivateKey = nip19.decode(`nsec1p0ht6p3wepe47sjrgesyn4m50m6avk2waqudu9rl324cg2c4ufesyp6rdg`).data
// const recipientPrivateKey = nip19.decode(`nsec1uyyrnx7cgfp40fcskcr2urqnzekc20fj0er6de0q8qvhx34ahazsvs9p36`).data
// const recipientPublicKey = getPublicKey(recipientPrivateKey)

// const rumor = createRumor(
//   {
//     kind: 1,
//     content: "Are you going to the party tonight?",
//   },
//   senderPrivateKey
// )

// const seal = createSeal(rumor, senderPrivateKey, recipientPublicKey)
// const wrap = createWrap(seal, recipientPublicKey)

// // Recipient unwraps with his/her private key.

// const unwrappedSeal = nip44Decrypt(wrap, recipientPrivateKey)
// const unsealedRumor = nip44Decrypt(unwrappedSeal, recipientPrivateKey)




export default function useNip59() {

  const now = () => Math.round(Date.now() / 1000)
  const randomNow = () => Math.round(now() - (Math.random() * TWO_DAYS))
  const { nip44Encrypt, nip44Decrypt } = useNip44()

  const createRumor = (event: Partial<UnsignedEvent>, privateKey: Uint8Array) => {
    const rumor = {
      created_at: now(),
      content: "",
      tags: [],
      ...event,
      pubkey: getPublicKey(privateKey),
    } as any

    rumor.id = getEventHash(rumor)

    return rumor as Rumor
  }
  
  const createSeal = (rumor: Rumor, privateKey: Uint8Array, recipientPublicKey: string = MOSTRO_PUB_KEY) => {
    return finalizeEvent(
      {
        kind: 13,
        content: nip44Encrypt(rumor, privateKey, recipientPublicKey),
        created_at: randomNow(),
        tags: [],
      },
      privateKey
    ) as Event
  }

  const createWrap = (event: Event, recipientPublicKey: string = MOSTRO_PUB_KEY) => {
    const randomKey = generateSecretKey()

    return finalizeEvent(
      {
        kind: 1059,
        content: nip44Encrypt(event, randomKey, recipientPublicKey),
        created_at: randomNow(),
        tags: [["p", recipientPublicKey]],
      },
      randomKey
    ) as Event
  }

  const unWrapSeal = (wrap: Event, recipientPrivateKey: Uint8Array) => {
    return nip44Decrypt(wrap, recipientPrivateKey)
  }

  const unSealRumor = (unwrappedSeal: Event, recipientPrivateKey: Uint8Array) => {
    return nip44Decrypt(unwrappedSeal, recipientPrivateKey)
  }

  return { createRumor, createSeal, createWrap, unWrapSeal, unSealRumor }
}
