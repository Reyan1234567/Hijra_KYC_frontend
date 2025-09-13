/*
 * HIJRA KYC FRONTEND - AUTHENTICATION CONTEXT
 * 
 * FILE TYPE: React Context Definition
 * PURPOSE: Defines authentication context structure for global state management
 * 
 * FUNCTIONALITY:
 * - Creates React context for authentication state
 * - Provides type-safe context definition
 * - Used throughout app for accessing authentication state
 * 
 * CONTEXT STRUCTURE (AuthInfo):
 * - user: Current user information (userInfo | null)
 * - login: Function to authenticate user
 * - logout: Function to log out user
 * - messageCount: Unread message count
 * - setMessageCount: Update message count
 * - rejectedCount: Rejected forms count
 * - setRejectedCount: Update rejected count
 * - pendingCount: Pending forms count
 * - setPendingCount: Update pending count
 * 
 * USED BY: AuthProvider.tsx (provides context) and all components needing auth state
 */

import { createContext } from "react";
import { AuthInfo } from "../types/ContextFiles";


export const AuthContext = createContext<AuthInfo | undefined>(undefined);

