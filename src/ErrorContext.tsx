/*
 * Copyright 2020 Bloomreach
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
import { ProductNotFoundError } from './components';

// eslint-disable-next-line no-shadow
export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  GENERAL_ERROR = 'GENERAL_ERROR',
}

interface ErrorContextProps {
  errorCode?: ErrorCode;
  error?: Error;
  requestURL?: string;
}

interface ErrorContextState {
  errorCode?: ErrorCode;
  error?: Error;
  requestURL?: string;
}

export const ErrorContext = React.createContext<ErrorContextProps>({});
export const ErrorContextConsumer = ErrorContext.Consumer;
export class ErrorContextProvider extends React.Component<React.PropsWithChildren<any>, ErrorContextState> {
  private static hasError = false;

  constructor(props: React.PropsWithChildren<any>) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: Error | AxiosError): ErrorContextState {
    let errorCode: ErrorCode;
    let requestURL: string | undefined;
    if ('isAxiosError' in error && error.isAxiosError) {
      requestURL = error.config.url;
      const status = error.response?.status;
      errorCode = status === 404 ? ErrorCode.NOT_FOUND : ErrorCode.INTERNAL_SERVER_ERROR;
    } else if (error instanceof ProductNotFoundError) {
      errorCode = ErrorCode.NOT_FOUND;
    } else {
      errorCode = ErrorCode.GENERAL_ERROR;
    }

    ErrorContextProvider.hasError = true;
    return { errorCode, error, requestURL };
  }

  componentDidCatch(): void {
    ErrorContextProvider.hasError = false;
  }

  render(): React.ReactElement | null {
    const { errorCode, error, requestURL } = this.state;
    const value: ErrorContextProps = ErrorContextProvider.hasError ? { errorCode, error, requestURL } : {};
    const { children } = this.props;
    return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
  }
}
