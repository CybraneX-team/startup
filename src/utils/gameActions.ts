export interface StartNewSimulationParams {
  user: any;
  setUser: (user: any) => void;
  setUserState: (user: any) => void;
  setloader?: (value: boolean) => void;
}

export interface StartNewSimulationResult {
  success: boolean;
  response?: any;
  insufficientCredits?: boolean;
}

// Shared helper to start a new simulation game for the current user/game
export async function startNewSimulation({
  user,
  setUser,
  setUserState,
  setloader,
}: StartNewSimulationParams): Promise<StartNewSimulationResult> {
  try {
    if (setloader) setloader(true);

    const makeReq = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/create-new-game`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          gameId: user?.gameId,
        }),
      },
    );

    if (makeReq.ok) {
      const response = await makeReq.json();
      setUser(response);
      setUserState(response);
      
      // Check if the response indicates insufficient credits
      const hasInsufficientCredits = response.message?.some(
        (msg: any) => msg.isPositive === false && msg.message?.toLowerCase().includes("credits")
      );
      
      if (hasInsufficientCredits) {
        return {
          success: false,
          response,
          insufficientCredits: true,
        };
      }
      
      return {
        success: true,
        response,
        insufficientCredits: false,
      };
    } else {
      console.error(
        `Request failed with status ${makeReq.status}: ${makeReq.statusText}`,
      );
      return {
        success: false,
        insufficientCredits: false,
      };
    }
  } catch (error) {
    console.error("An error occurred while starting new simulation:", error);
    return {
      success: false,
      insufficientCredits: false,
    };
  } finally {
    if (setloader) setloader(false);
  }
}


