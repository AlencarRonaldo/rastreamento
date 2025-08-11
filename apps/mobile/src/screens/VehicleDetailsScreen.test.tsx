import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { VehicleDetailsScreen } from './VehicleDetailsScreen';
import { useRoute } from '@react-navigation/native';
import type { Vehicle } from '@vehicle-tracking/shared';

// Mock useRoute hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: jest.fn(),
}));

describe('VehicleDetailsScreen', () => {
  const mockVehicle: Vehicle = {
    id: 'test-id-123',
    plate: 'MOCK-PLATE',
    lastPosition: {
      latitude: -23.5505,
      longitude: -46.6333,
      speed: 75,
      heading: 120,
      ignition: true,
      battery: 90,
      timestamp: new Date().toISOString(),
    },
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    (useRoute as jest.Mock).mockReturnValue({ params: { vehicleId: 'test-id-123' } });
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockReturnValueOnce([null, jest.fn()]); // vehicle
    useStateSpy.mockReturnValueOnce([true, jest.fn()]); // loading
    useStateSpy.mockReturnValueOnce([null, jest.fn()]); // error

    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation(() => {}); // Prevent useEffect from running

    const { getByText } = render(<VehicleDetailsScreen />);
    expect(getByText('Carregando detalhes do veículo...')).toBeTruthy();
  });

  it('renders vehicle details after loading', async () => {
    (useRoute as jest.Mock).mockReturnValue({ params: { vehicleId: 'test-id-123' } });
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockReturnValueOnce([mockVehicle, jest.fn()]); // vehicle
    useStateSpy.mockReturnValueOnce([false, jest.fn()]); // loading
    useStateSpy.mockReturnValueOnce([null, jest.fn()]); // error

    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation((cb) => { cb(); return () => {}; }); // Allow useEffect to run

    const { getByText } = render(<VehicleDetailsScreen />);

    await waitFor(() => expect(getByText('Placa: MOCK-PLATE')).toBeTruthy());
    expect(getByText('ID: test-id-123')).toBeTruthy();
    expect(getByText('Velocidade: 75 km/h')).toBeTruthy();
    expect(getByText('Ignição: Ligada')).toBeTruthy();
  });

  it('renders error message if fetching fails', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    (useRoute as jest.Mock).mockReturnValue({ params: { vehicleId: 'test-id-123' } });
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockReturnValueOnce([null, jest.fn()]); // vehicle
    useStateSpy.mockReturnValueOnce([false, jest.fn()]); // loading
    useStateSpy.mockReturnValueOnce(['Failed to fetch', jest.fn()]); // error

    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation((cb) => { cb(); return () => {}; }); // Allow useEffect to run

    const { getByText } = render(<VehicleDetailsScreen />);

    await waitFor(() => expect(getByText('Erro: Failed to fetch vehicle details')).toBeTruthy());

    console.error = originalError;
  });

  it('renders "Veículo não encontrado" if vehicle is null after loading', async () => {
    (useRoute as jest.Mock).mockReturnValue({ params: { vehicleId: 'test-id-123' } });
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockReturnValueOnce([null, jest.fn()]); // vehicle
    useStateSpy.mockReturnValueOnce([false, jest.fn()]); // loading
    useStateSpy.mockReturnValueOnce([null, jest.fn()]); // error

    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation((cb) => { cb(); return () => {}; }); // Allow useEffect to run

    const { getByText } = render(<VehicleDetailsScreen />);

    await waitFor(() => expect(getByText('Veículo não encontrado.')).toBeTruthy());
  });
});