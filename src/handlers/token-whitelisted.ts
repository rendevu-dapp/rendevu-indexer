// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { WhitelistedToken } from "../model";

// types
import type { Context, Log } from "../processor";

export async function handleTokenWhitelisted(ctx: Context, log: Log) {
  // decode the log
  let { paymentToken, isWhitelisted } =
    eventPlatformAbi.events.TokenWhiteListed.decode(log);

  // load the whitelisted token from the store
  let whitelistedToken = await ctx.store.get(WhitelistedToken, paymentToken);
  if (!whitelistedToken) {
    // create a new whitelisted token if it doesn't exist
    whitelistedToken = new WhitelistedToken({
      id: paymentToken,
      tokenAddress: paymentToken,
    });
  }
  whitelistedToken.isWhitelisted = isWhitelisted;
  whitelistedToken.updatedAt = BigInt(log.block.timestamp);

  await ctx.store.upsert(whitelistedToken);
  ctx.log.info(
    `Token ${paymentToken} whitelisted status updated to ${isWhitelisted}.`
  );
}
