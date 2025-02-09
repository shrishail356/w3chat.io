import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Copy } from "lucide-react";
interface Token {
  token_address: string;
  symbol: string;
  name: string;
  logo?: string;
  balance: string;
  balance_formatted: string;
  usd_price: number;
  usd_price_24hr_percent_change: number;
}
import {toast, ToastContainer } from 'react-toastify';

const PortfolioSidebar = ({ isOpen, walletAddress }: { isOpen: boolean; walletAddress: string }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [chainHex, setChainHex] = useState<string | null>(null);

  // Fetch connected chain ID and convert to hexadecimal
  const fetchChainId = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        setChainHex(chainId);
      } catch (error) {
        console.error("Error fetching chain ID:", error);
      }
    } else {
      console.warn("Ethereum provider not detected");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchChainId();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!walletAddress || !chainHex) return;

      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
        const response = await axios.get(
          `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/tokens`,
          {
            params: { chain: chainHex }, 
            headers: {
              accept: "application/json",
              "X-API-Key": apiKey!,
            },
          }
        );

        const tokensArray = response.data.result; 
        if (!Array.isArray(tokensArray)) {
          console.error("Tokens data is not an array:", tokensArray);
          return;
        }

        // Format tokens for UI display
        const formattedTokens = tokensArray.map((token: any) => ({
          token_address: token.token_address,
          symbol: token.symbol,
          name: token.name,
          logo: token.logo,
          balance: token.balance,
          balance_formatted: parseFloat(token.balance_formatted).toFixed(4), 
          usd_price: token.usd_price || 0,
          usd_price_24hr_percent_change: token.usd_price_24hr_percent_change || 0,
        }));

        setTokens(formattedTokens);
      } catch (error) {
        console.error("Error fetching token balances:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && walletAddress && chainHex) {
      fetchTokens();
    }
  }, [walletAddress, isOpen, chainHex]);

  // Filter tokens by name or symbol
  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(filter.toLowerCase()) ||
    token.symbol.toLowerCase().includes(filter.toLowerCase())
  );
  

  return (
    <div
      className={`fixed right-0 top-16 z-20
        ${isOpen ? "w-96 opacity-100" : "w-0 opacity-0"}

        h-[calc(100vh-64px)] bg-white/5 backdrop-blur-md transition-all duration-300
        border-l border-white/10 overflow-hidden
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="h-full flex flex-col">
        <div className="p-3.5 border-b border-white/10">
          <h2 className="text-lg font-semibold">Wallet Portfolio</h2>
          <h3 className="text-sm text-gray-400">
            {chainHex}
          </h3>
          <input
            type="text"
            placeholder="Filter tokens..."
            className="w-full mt-2 p-2 rounded bg-black/40 text-gray-300 border border-white/10"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {loading ? (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-300"></div>
      </div>
    ) : filteredTokens.length > 0 ? (
      <div className="space-y-6">
        {/* Native Token Section */}
        {filteredTokens[0] && (
          <div>
            <h2 className="text-lg font-bold text-white mb-2">Native Token</h2>
            <div className="bg-black/40 rounded-lg p-4 border border-white/5">
              <div className="flex items-center space-x-4">
                {/* Token Logo */}
                <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center overflow-hidden">
                  {filteredTokens[0].logo ? (
                    <img
                      src={filteredTokens[0].logo}
                      alt={filteredTokens[0].symbol}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-bold text-white">
                      {filteredTokens[0].symbol.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Token Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-base font-medium text-white">
                      {filteredTokens[0].name.length > 15
                        ? `${filteredTokens[0].name.slice(0, 15)}...`
                        : filteredTokens[0].name}
                    </h3>
                  </div>
                  <div className="mt-1">
                    <p className="text-lg font-mono text-cyan-300">
                      {parseFloat(filteredTokens[0].balance_formatted).toFixed(2)}{" "}
                      {filteredTokens[0].symbol.length > 12
                        ? `${filteredTokens[0].symbol.slice(0, 12)}...`
                        : filteredTokens[0].symbol}
                    </p>
                    <p className="text-sm text-gray-400">
                      ≈ $
                      {(
                        parseFloat(filteredTokens[0].balance_formatted) *
                        filteredTokens[0].usd_price
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Price Information */}
                <div className="text-right">
                  <p className="text-base text-white">
                    ${filteredTokens[0].usd_price.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm ${
                      filteredTokens[0].usd_price_24hr_percent_change >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {filteredTokens[0].usd_price_24hr_percent_change >= 0
                      ? "+"
                      : ""}
                    {filteredTokens[0].usd_price_24hr_percent_change.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tokens Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-2">
            Other Tokens ({filteredTokens.length - 1})
          </h2>
          <div className="space-y-3">
            {filteredTokens.slice(1).map((token) => (
              <div
                key={token.token_address}
                className="bg-black/40 rounded-lg p-4 border border-white/5"
              >
                <div className="flex items-center space-x-4">
                  {/* Token Logo */}
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center overflow-hidden">
                    {token.logo ? (
                      <img
                        src={token.logo}
                        alt={token.symbol}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-bold text-white">
                        {token.symbol.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Token Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2">
                      <h3 className="text-base font-medium text-white">
                        {token.name.length > 15
                          ? `${token.name.slice(0, 15)}...`
                          : token.name}
                      </h3>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(token.token_address);
                          toast.success("Address copied to clipboard!");
                        }}
                        className="text-gray-400 hover:text-white transition duration-200"
                        title="Copy Token Address"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-1">
                      <p className="text-lg font-mono text-cyan-300">
                        {parseFloat(token.balance_formatted).toFixed(2)}{" "}
                        {token.symbol.length > 12
                          ? `${token.symbol.slice(0, 12)}...`
                          : token.symbol}
                      </p>
                      <p className="text-sm text-gray-400">
                        ≈ $
                        {(
                          parseFloat(token.balance_formatted) * token.usd_price
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Price Information */}
                  <div className="text-right">
                    <p className="text-base text-white">
                      ${token.usd_price.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm ${
                        token.usd_price_24hr_percent_change >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {token.usd_price_24hr_percent_change >= 0 ? "+" : ""}
                      {token.usd_price_24hr_percent_change.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center text-gray-400">No tokens found</div>
    )}

      </div>

      </div>
      <ToastContainer position='top-center'/>
    </div>
  );
};

export default PortfolioSidebar;

