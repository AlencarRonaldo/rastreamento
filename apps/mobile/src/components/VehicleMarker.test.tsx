import React from 'react';
import { render } from '@testing-library/react-native';
import { VehicleMarker } from './VehicleMarker';
import type { Vehicle } from '@vehicle-tracking/shared';

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  const MockMarker = (props: any) => <View testID="marker">{props.children}</View>;
  return {
    __esModule: true,
    default: View,
    Marker: MockMarker,
  };
});

describe('VehicleMarker', () => {
  const mockVehicle: Vehicle = {
    id: '1',
    plate: 'ABC-1234',
    lastPosition: {
      latitude: -23.5505,
      longitude: -46.6333,
      ignition: true,
      speed: 50,
      heading: 90,
      battery: 95,
      timestamp: new Date().toISOString(),
    },
  };

  it('renders correctly when vehicle has a position', () => {
    const { getByText, getByTestId } = render(
      <VehicleMarker vehicle={mockVehicle} onPress={() => {}} />
    );

    // Check if the marker and plate are rendered
    expect(getByTestId('marker')).toBeTruthy();
    expect(getByText('ABC-1234')).toBeTruthy();
  });

  it('does not render if vehicle has no position', () => {
    const vehicleWithoutPosition = { ...mockVehicle, lastPosition: undefined };
    const { queryByTestId } = render(
      <VehicleMarker vehicle={vehicleWithoutPosition} onPress={() => {}} />
    );

    // Check that nothing is rendered
    expect(queryByTestId('marker')).toBeNull();
  });

  it('shows moving color when speed is > 0', () => {
    const { getByText } = render(
      <VehicleMarker vehicle={mockVehicle} onPress={() => {}} />
    );
    const markerContainer = getByText('🚗').parent.parent;
    expect(markerContainer.props.style.backgroundColor).toBe('#10b981'); // Verde
  });

  it('shows stopped color when speed is 0 and ignition is on', () => {
    const stoppedVehicle: Vehicle = {
      ...mockVehicle,
      lastPosition: {
        latitude: -23.5505,
        longitude: -46.6333,
        ignition: true,
        speed: 0,
        heading: 90,
        battery: 95,
        timestamp: new Date().toISOString(),
      },
    };
    const { getByText } = render(
      <VehicleMarker vehicle={stoppedVehicle} onPress={() => {}} />
    );
    const markerContainer = getByText('🚗').parent.parent;
    expect(markerContainer.props.style.backgroundColor).toBe('#f59e0b'); // Amarelo
  });

  it('shows off color when ignition is off', () => {
    const offVehicle: Vehicle = {
      ...mockVehicle,
      lastPosition: {
        latitude: -23.5505,
        longitude: -46.6333,
        ignition: false,
        speed: 0,
        heading: 90,
        battery: 95,
        timestamp: new Date().toISOString(),
      },
    };
    const { getByText } = render(
      <VehicleMarker vehicle={offVehicle} onPress={() => {}} />
    );
    const markerContainer = getByText('🚗').parent.parent;
    expect(markerContainer.props.style.backgroundColor).toBe('#6b7280'); // Cinza
  });
});
