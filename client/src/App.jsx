import { Suspense } from "react";
import { useRecoilValue } from "recoil";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Toaster } from "react-hot-toast";

import { GlobalStyles, lightTheme, darkTheme } from "./styled";
import Navbar from "./Componenets/Navbar";
import Home from "./Routes/Home";
import Auth from "./Routes/Auth";
import Me from "./Routes/Me";
import Posts from "./Routes/Posts";
import Post from "./Routes/Post";
import Loader from "./Componenets/Loader";
import PostUpdate from "./Routes/PostUpdate";
import PostUpload from "./Routes/PostUpload";
import ProMain from "./Routes/ProMain";
import ProRegister from "./Routes/ProRegister";
import Pro from "./Routes/Pro";
import ProUpdate from "./Routes/ProUpdate";
import Messenger from "./Routes/Messenger";
import { isAuthAtom } from "./atoms/isAuthAtom";
import { isDarkAtom } from "./atoms/isDarkAtom";
import ProtectRoute from "./Componenets/ProtectRoute";

function App() {
    const isDark = useRecoilValue(isDarkAtom);
    const { user } = useRecoilValue(isAuthAtom);

    return (
        <BrowserRouter>
            <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
                <GlobalStyles />
                <Navbar />
                <Switch>
                    <Route exact path="/" render={() => <Home />} />
                    <Route path="/auth" render={() => <Auth />} />
                    <Route
                        exact
                        path="/messenger"
                        render={() => (
                            <ProtectRoute>
                                <Messenger />
                            </ProtectRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts"
                        render={() => (
                            <ProtectRoute isAllowed={user}>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <Posts />
                                </Suspense>
                            </ProtectRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts/upload"
                        render={() => (
                            <ProtectRoute isAllowed={user}>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <PostUpload />
                                </Suspense>
                            </ProtectRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts/:id"
                        render={() => (
                            <ProtectRoute isAllowed={user}>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <Post />
                                </Suspense>
                            </ProtectRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts/:id/update"
                        render={() => (
                            <ProtectRoute isAllowed={user}>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <PostUpdate />
                                </Suspense>
                            </ProtectRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/me"
                        render={() => (
                            <ProtectRoute isAllowed={user}>
                                <Me />
                            </ProtectRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/pro"
                        render={() => (
                            <ProtectRoute isAllowed={user}>
                                <ProMain />
                            </ProtectRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/pro/register"
                        render={() => (
                            <ProtectRoute isAllowed={user}>
                                <ProRegister />
                            </ProtectRoute>
                        )}
                    />

                    <Route
                        exact
                        path="/pro/:id"
                        render={() => (
                            <ProtectRoute isAllowed={user}>
                                <Pro />
                            </ProtectRoute>
                        )}
                    ></Route>
                    <Route
                        exact
                        path="/pro/:id/update"
                        render={() => (
                            <ProtectRoute isAllowed={user}>
                                <ProUpdate />
                            </ProtectRoute>
                        )}
                    ></Route>
                    {/* <Route exact path="/" render={() => <Home />} />
                    <Route path="/auth" render={() => <Auth />} />
                    <Route
                        exact
                        path="/messenger"
                        render={() => (
                            <OnlyUserRoute>
                                <Messenger />
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts"
                        render={() => (
                            <OnlyUserRoute>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <Posts />
                                </Suspense>
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts/upload"
                        render={() => (
                            <OnlyUserRoute>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <PostUpload />
                                </Suspense>
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts/:id"
                        render={() => (
                            <OnlyUserRoute>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <Post />
                                </Suspense>
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts/:id/update"
                        render={() => (
                            <OnlyUserRoute>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <PostUpdate />
                                </Suspense>
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/me"
                        render={() => (
                            <OnlyUserRoute>
                                <Me />
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/pro"
                        render={() => (
                            <OnlyUserRoute>
                                <ProMain />
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/pro/register"
                        render={() => (
                            <OnlyUserRoute>
                                <ProRegister />
                            </OnlyUserRoute>
                        )}
                    />

                    <Route
                        exact
                        path="/pro/:id"
                        render={() => (
                            <OnlyUserRoute>
                                <Pro />
                            </OnlyUserRoute>
                        )}
                    ></Route>
                    <Route
                        exact
                        path="/pro/:id/update"
                        render={() => (
                            <OnlyUserRoute>
                                <ProUpdate />
                            </OnlyUserRoute>
                        )}
                    ></Route> */}
                </Switch>
                <Toaster />
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
