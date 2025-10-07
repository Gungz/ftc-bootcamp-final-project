"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useCreatorPlatform } from "~~/hooks/creator-platform/useCreatorPlatform";

export const CreateSpaceForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  const { createCreatorSpace } = useCreatorPlatform();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || !price) return;

    setLoading(true);
    try {
      await createCreatorSpace(name, symbol, description, parseEther(price));
      setName("");
      setSymbol("");
      setPrice("");
      setDescription("");
      onSuccess?.();
    } catch (error) {
      console.error("Error creating space:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Create Your Creator Space</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Space Name</span>
            </label>
            <input
              type="text"
              placeholder="My Creator Space"
              className="input input-bordered"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Symbol</span>
            </label>
            <input
              type="text"
              placeholder="MCS"
              className="input input-bordered"
              value={symbol}
              onChange={e => setSymbol(e.target.value.toUpperCase())}
              maxLength={5}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <input
              type="text"
              placeholder="Creator Space Description"
              className="input input-bordered"
              value={description} 
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Membership Price (GUNG)</span>
            </label>
            <input
              type="number"
              step="0.001"
              placeholder="0.1"
              className="input input-bordered"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : "Create Space"}
          </button>
        </form>
      </div>
    </div>
  );
};
