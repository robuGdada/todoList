import type { AppProps } from "next/app";
import "../components/TodoList.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
