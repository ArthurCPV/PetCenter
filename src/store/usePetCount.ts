import { useCallback, useState } from "react";

import { listPetsByUser } from "../api/pets";
import type { ApiUserResponse } from "../types/api";

type PetCountState =
  | { status: "loading" }
  | { status: "ready"; count: number }
  | { status: "error" };

const usePetCount = (user: ApiUserResponse | undefined) => {
  const [state, setState] = useState<PetCountState>({ status: "loading" });

  const load = useCallback(async (): Promise<void> => {
    if (!user || user.tipoUsuario !== "TUTOR") {
      setState({ status: "ready", count: 0 });
      return;
    }

    setState({ status: "loading" });

    try {
      const pets = await listPetsByUser(user.id);
      setState({ status: "ready", count: pets.length });
    } catch (error) {
      console.error("Não foi possível carregar a quantidade de pets:", error);
      setState({ status: "error" });
    }
  }, [user]);

  return { state, load };
};

export { usePetCount };
