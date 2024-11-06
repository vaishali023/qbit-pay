import {
  createDataItemSigner,
  dryrun,
  message,
  result,
} from "@permaweb/aoconnect/browser";
import { QBIT_PROCESS_ID } from "../constants";

export type SendMessageArgs = {
  data?: string;
  tags: {
    name: string;
    value: string;
  }[];
  pid?: string;
  anchor?: string;
};

export async function sendMessage({ tags, data, pid }: SendMessageArgs) {
  const args = {
    process: pid || QBIT_PROCESS_ID,
    tags,
    signer: createDataItemSigner(window.arweaveWallet),
  } as any;

  if (data) args.data = data;

  const messageId = await message(args);

  const { Output } = await result({
    message: messageId,
    process: pid || QBIT_PROCESS_ID,
  });

  if (Output?.data?.output) {
    throw new Error(extractMessage(Output?.data?.output));
  }

  return messageId;
}

export async function dryrunMessage({ tags, data, pid }: SendMessageArgs) {
  const args = {
    process: pid || QBIT_PROCESS_ID,
    tags,
  } as any;

  return dryrun(args);
}

export function extractMessage(text: string) {
  // This regex aims to ignore any bracketed content that immediately precedes the message.
  // It looks for:
  // 1. The last colon in the text followed by optional whitespace (\s*),
  // 2. Optionally any bracketed content with optional leading and trailing whitespaces (\s*\[[^\]]*\]\s*),
  // 3. Finally, it captures the remaining text, which should be the error message.
  const regex = /:\s*(?:\s*\[[^\]]*\]\s*)?([^:]+)$/;
  const match = text.match(regex);

  // If a match is found, return the captured group (the error message).
  // Else, return text
  return match ? match[1].trim() : text;
}
