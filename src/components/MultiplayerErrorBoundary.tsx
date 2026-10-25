import React, { Component, type ReactNode } from 'react';
import { MultiplayerFallbackScreen } from './MultiplayerFallbackScreen';
import { logHealthError } from '@/lib/ytPlayables';

interface Props {
  children: ReactNode;
  onBack: () => void;
  onStartPassAndPlay?: () => void;
  onStartSoloAI?: () => void;
  onOpenDebug?: () => void;
}

interface State {
  hasError: boolean;
  error: string | null;
}

export class MultiplayerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: error?.message || 'An unexpected error occurred in the multiplayer subsystem.',
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    logHealthError('MULTIPLAYER_INIT_FAILED', `Multiplayer component crashed: ${error?.message}`, {
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <MultiplayerFallbackScreen
          error={this.state.error}
          onRetry={this.handleReset}
          onBack={this.props.onBack}
          onStartPassAndPlay={this.props.onStartPassAndPlay}
          onStartSoloAI={this.props.onStartSoloAI}
          onOpenDebug={this.props.onOpenDebug}
        />
      );
    }

    return this.props.children;
  }
}

export default MultiplayerErrorBoundary;
