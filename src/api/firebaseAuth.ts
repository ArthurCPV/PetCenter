import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { auth } from "../../firebaseConfig";

type FirebaseAuthError = {
  code?: unknown;
};

const isFirebaseAuthError = (error: unknown): error is FirebaseAuthError => {
  return typeof error === "object" && error !== null && "code" in error;
};

export class FirebaseEmailAlreadyInUseError extends Error {
  constructor() {
    super("Este e-mail já está cadastrado.");
    this.name = "FirebaseEmailAlreadyInUseError";
  }
}

const getFirebaseAuthErrorMessage = (error: unknown): string => {
  if (!isFirebaseAuthError(error)) {
    return "Não foi possível autenticar no Firebase.";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "O e-mail informado é inválido.";

    case "auth/weak-password":
      return "A senha informada é muito fraca.";

    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Usuário não encontrado ou senha incorreta.";

    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente mais tarde.";

    default:
      return "Não foi possível autenticar no Firebase.";
  }
};

export const registerFirebaseUser = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return credential.user;
  } catch (error) {
    if (
      isFirebaseAuthError(error) &&
      error.code === "auth/email-already-in-use"
    ) {
      throw new FirebaseEmailAlreadyInUseError();
    }

    throw new Error(getFirebaseAuthErrorMessage(error));
  }
};

export const loginFirebaseUser = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    return credential.user;
  } catch (error) {
    throw new Error(getFirebaseAuthErrorMessage(error));
  }
};

export const logoutFirebaseUser = async (): Promise<void> => {
  await signOut(auth);
};

export const deleteCurrentFirebaseUser = async (): Promise<void> => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    await deleteUser(currentUser);
  }
};

export const getCurrentFirebaseUser = (): User | null => {
  return auth.currentUser;
};
