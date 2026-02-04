import crypto from "node:crypto";
import config from "./config.js";

const sessions = new Map();

const now = () => Date.now();

const trimMessages = (messages) => {
  const max = config.memoryMaxMessages;
  if (!Array.isArray(messages)) return [];
  if (messages.length <= max) return messages;
  return messages.slice(messages.length - max);
};

const cleanupExpired = () => {
  const ttl = config.memoryTtlMs;
  const current = now();
  for (const [sessionId, session] of sessions.entries()) {
    if (current - session.updatedAt > ttl) {
      sessions.delete(sessionId);
    }
  }
};

export const getOrCreateSession = (sessionId) => {
  cleanupExpired();
  if (sessionId && sessions.has(sessionId)) {
    const session = sessions.get(sessionId);
    session.updatedAt = now();
    return session;
  }

  const id = sessionId || crypto.randomUUID();
  const session = {
    id,
    messages: [],
    createdAt: now(),
    updatedAt: now(),
  };
  sessions.set(id, session);
  return session;
};

export const setSessionMessages = (sessionId, messages) => {
  const session = getOrCreateSession(sessionId);
  session.messages = trimMessages(messages);
  session.updatedAt = now();
  return session;
};

export const appendSessionMessages = (sessionId, newMessages) => {
  const session = getOrCreateSession(sessionId);
  const combined = [...session.messages, ...newMessages];
  session.messages = trimMessages(combined);
  session.updatedAt = now();
  return session;
};

export const getSessionSnapshot = (sessionId) => {
  const session = getOrCreateSession(sessionId);
  return {
    id: session.id,
    messages: session.messages,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
};
