export interface StartNewSimulationParams {
  user: any;
  setUser: (user: any) => void;
  setUserState: (user: any) => void;
  setloader?: (value: boolean) => void;
}

// Shared helper to start a new simulation game for the current user/game
export async function startNewSimulation({
  user,
  setUser,
  setUserState,
  setloader,
}: StartNewSimulationParams): Promise<any | null> {
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
      return response;
    } else {
      console.error(
        `Request failed with status ${makeReq.status}: ${makeReq.statusText}`,
      );
      return null;
    }
  } catch (error) {
    console.error("An error occurred while starting new simulation:", error);
    return null;
  } finally {
    if (setloader) setloader(false);
  }
}


