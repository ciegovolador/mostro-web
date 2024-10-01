import { bytesToHex } from "@noble/hashes/utils"
import type { EventTemplate, Event } from "nostr-tools"
import { nip44 } from "nostr-tools"


export default function useNip44() {

  const nip44ConversationKey = (privateKey: Uint8Array, publicKey: string) => {
    // @ts-ignore  
    return  nip44.v2.utils.getConversationKey(bytesToHex(privateKey), publicKey)
  }
   

  const nip44Encrypt = (data: EventTemplate, privateKey: Uint8Array, publicKey: string) =>
    nip44.v2.encrypt(JSON.stringify(data), nip44ConversationKey(privateKey, publicKey))

  const nip44Decrypt = (data: Event, privateKey: Uint8Array) =>
    JSON.parse(nip44.v2.decrypt(data.content, nip44ConversationKey(privateKey, data.pubkey)))

  return { nip44ConversationKey, nip44Encrypt, nip44Decrypt }
}
