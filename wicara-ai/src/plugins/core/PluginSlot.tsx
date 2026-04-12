import React from 'react';
import { PluginManager } from './PluginManager';
import type { AvailableSlot } from './types';

// Component to render slot content
interface PluginSlotComponentProps {
  name: AvailableSlot;
  context: Record<string, unknown>;
}

export const PluginSlot: React.FC<PluginSlotComponentProps> = ({ name, context }) => {
  const components = PluginManager.getSlotComponents(name);

  return (
    <>
      {components.map((Component, index) => (
        <Component key={`${name}-${index}`} context={context} />
      ))}
    </>
  );
};
