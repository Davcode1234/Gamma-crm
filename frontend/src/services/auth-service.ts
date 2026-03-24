// eslint-disable-next-line
import { Config } from '../config';

type SignUpProps = {
  email: string;
  img: string;
  job: string;
  lastname: string;
  name: string;
  password: string;
  phone: number;
  roles: string[];
};

export async function signUp({
  name,
  lastname,
  email,
  phone,
  password,
  job,
  img,
  roles,
}: SignUpProps): Promise<void> {
  const formInfo = {
    name,
    lastname,
    email,
    phone,
    password,
    job,
    img,
    roles,
  };

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formInfo),
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

type SignInProps = {
  email: string;
  password: string;
  grantType?: 'cookie' | 'token';
};

export async function signIn({ email, password }: SignInProps): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/signin`,
    {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
        grantType: 'cookie',
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

export async function signOut(): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/signout`,
    {
      method: 'POST',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}
