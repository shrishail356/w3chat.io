import { ethers } from "ethers";

export async function resolveENSDomain(
  provider: ethers.Provider,
  domain: string
): Promise<string> {
  if (!domain || typeof domain !== "string") {
    throw new Error("Invalid domain. Expected a non-empty string.");
  }

  try {
    const resolvedAddress = await provider.resolveName(domain);
    if (!resolvedAddress) {
      throw new Error(`Could not resolve ENS domain: ${domain}`);
    }
    return resolvedAddress;
  } catch (error) {
    throw new Error(`Failed to resolve ENS domain: ${domain}`);
  }
}
