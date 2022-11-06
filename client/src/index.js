import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <RecoilRoot>
            <App />
        </RecoilRoot>
    </QueryClientProvider>,
    // <React.StrictMode>
    //     <QueryClientProvider client={queryClient}>
    //         <RecoilRoot>
    //             <App />
    //         </RecoilRoot>
    //     </QueryClientProvider>
    // </React.StrictMode>,
    document.getElementById("root")
);
