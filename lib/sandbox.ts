import * as fs from "fs/promises";
import * as path from "path";

const SANDBOX_ROOT = path.join(process.cwd(), "sandbox");

/**
 * Ensures the sandbox directory exists
 */
async function ensureSandboxDir(): Promise<void> {
  try {
    await fs.mkdir(SANDBOX_ROOT, { recursive: true });
  } catch (error) {
    console.error("Failed to create sandbox directory:", error);
    throw new Error("Could not initialize sandbox directory");
  }
}

/**
 * Validates and resolves a sandbox path with user scoping, preventing directory traversal
 */
function resolveSandboxPath(relativePath: string, userId: string): string {
  // User-scoped sandbox directory
  const userSandboxRoot = path.join(SANDBOX_ROOT, userId);
  
  // Remove any leading slashes or dots
  const sanitized = relativePath.replace(/^[./\\]+/, "");
  
  // Resolve the full path
  const fullPath = path.resolve(userSandboxRoot, sanitized);
  
  // Ensure the resolved path is still within the user's sandbox
  if (!fullPath.startsWith(userSandboxRoot)) {
    throw new Error("Invalid path: Directory traversal detected");
  }
  
  // Reject absolute paths
  if (path.isAbsolute(relativePath)) {
    throw new Error("Invalid path: Absolute paths are not allowed");
  }
  
  return fullPath;
}

/**
 * Writes content to a file in the user's sandbox
 */
export async function writeSandboxFile(
  relativePath: string,
  content: string,
  userId: string
): Promise<{ success: boolean; path: string; error?: string }> {
  try {
    await ensureSandboxDir();
    const fullPath = resolveSandboxPath(relativePath, userId);
    
    // Ensure parent directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    
    // Write the file
    await fs.writeFile(fullPath, content, "utf-8");
    
    return {
      success: true,
      path: relativePath,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      path: relativePath,
      error: errorMessage,
    };
  }
}

/**
 * Reads content from a file in the user's sandbox
 */
export async function readSandboxFile(
  relativePath: string,
  userId: string
): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    const fullPath = resolveSandboxPath(relativePath, userId);
    const content = await fs.readFile(fullPath, "utf-8");
    
    return {
      success: true,
      content,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Lists files in the user's sandbox (non-recursive by default)
 */
export async function listSandboxFiles(
  relativePath: string = "",
  userId: string
): Promise<{ success: boolean; files?: string[]; error?: string }> {
  try {
    await ensureSandboxDir();
    const fullPath = relativePath 
      ? resolveSandboxPath(relativePath, userId) 
      : path.join(SANDBOX_ROOT, userId);
    
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name);
    
    return {
      success: true,
      files,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Deletes a file from the user's sandbox
 */
export async function deleteSandboxFile(
  relativePath: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const fullPath = resolveSandboxPath(relativePath, userId);
    await fs.unlink(fullPath);
    
    return {
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Checks if a file exists in the user's sandbox
 */
export async function sandboxFileExists(
  relativePath: string,
  userId: string
): Promise<boolean> {
  try {
    const fullPath = resolveSandboxPath(relativePath, userId);
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}
