/*
 * Copyright 2020 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { AxiosError } from 'axios';

interface ErrorContextProps {
  errorCode?: number;
  error?: Error;
}

interface ErrorContextState {
  errorCode?: number;
  error?: Error;
}

export const ErrorContext = React.createContext<ErrorContextProps>({});
export const ErrorContextConsumer = ErrorContext.Consumer;
export class ErrorContextProvider extends React.Component<React.PropsWithChildren<any>, ErrorContextState> {
  static hasError = false;

  constructor(props: React.PropsWithChildren<any>) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: Error | AxiosError): ErrorContextState {
    let status;
    if ('isAxiosError' in error && error.isAxiosError) {
      status = error.response?.status;
    }

    ErrorContextProvider.hasError = true;
    return { error, errorCode: status === 404 ? 404 : 500 };
  }

  componentDidCatch(): void {
    ErrorContextProvider.hasError = false;
  }

  render(): React.ReactElement | null {
    const { error, errorCode } = this.state;
    const value: ErrorContextProps = ErrorContextProvider.hasError ? { error, errorCode } : {};
    const { children } = this.props;
    return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
  }
}
