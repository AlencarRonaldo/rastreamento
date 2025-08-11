import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { VehicleListScreen } from './VehicleListScreen';
import type { Vehicle } from '@vehicle-tracking/shared';

// Mock navigation prop
const mockNavigation = {
  navigate: jest.fn(),
};

describe('VehicleListScreen', () => {
  const mockVehicles: Vehicle[] = [
    { id: 'v1', plate: 'ABC-1234', lastPosition: { latitude: -23.55, longitude: -46.63, speed: 60, heading: 90, ignition: true, battery: 80, timestamp: new Date().toISOString() } },
    { id: 'v2', plate: 'DEF-5678', lastPosition: { latitude: -23.56, longitude: -46.64, speed: 0, heading: 0, ignition: false, battery: 70, timestamp: new Date().toISOString() } },
    { id: 'v3', plate: 'GHI-9012', lastPosition: { latitude: -23.57, longitude: -46.65, speed: 30, heading: 180, ignition: true, battery: 90, timestamp: new Date().toISOString() } },
    { id: 'v4', plate: 'JKL-3456', lastPosition: { latitude: -23.58, longitude: -46.66, speed: 0, heading: 0, ignition: true, battery: 85, timestamp: new Date().toISOString() } },
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading state initially', async () => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockReturnValueOnce([[], jest.fn()]); // vehicles
    useStateSpy.mockReturnValueOnce([true, jest.fn()]); // loading
    useStateSpy.mockReturnValueOnce([null, jest.fn()]); // error

    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation(() => {}); // Prevent useEffect from running immediately

    const { getByText } = render(<VehicleListScreen navigation={mockNavigation} />);
    expect(getByText('Carregando veículos...')).toBeTruthy();
  });

  it('renders a list of vehicles after loading', async () => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockReturnValueOnce([mockVehicles, jest.fn()]); // vehicles
    useStateSpy.mockReturnValueOnce([false, jest.fn()]); // loading
    useStateSpy.mockReturnValueOnce([null, jest.fn()]); // error

    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation((cb) => { cb(); return () => {}; }); // Allow useEffect to run

    const { getByText, getAllByText } = render(<VehicleListScreen navigation={mockNavigation} />);

    await waitFor(() => expect(getByText('ABC-1234')).toBeTruthy());
    expect(getByText('DEF-5678')).toBeTruthy();
    expect(getByText('GHI-9012')).toBeTruthy();
    expect(getByText('JKL-3456')).toBeTruthy();
    expect(getAllByText('Em Movimento').length).toBeGreaterThanOrEqual(1);
    expect(getByText('Desligado')).toBeTruthy();
    expect(getByText('Parado')).toBeTruthy();
  });

  it('navigates to VehicleDetails on item press', async () => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockReturnValueOnce([mockVehicles, jest.fn()]); // vehicles
    useStateSpy.mockReturnValueOnce([false, jest.fn()]); // loading
    useStateSpy.mockReturnValueOnce([null, jest.fn()]); // error

    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation((cb) => { cb(); return () => {}; }); // Allow useEffect to run

    const { getByText } = render(<VehicleListScreen navigation={mockNavigation} />);

    await waitFor(() => expect(getByText('ABC-1234')).toBeTruthy());

    const vehicleItem = getByText('ABC-1234');
    fireEvent.press(vehicleItem);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('VehicleDetails', { vehicleId: 'v1' });
  });

  it('renders error message if fetching fails', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockReturnValueOnce([[], jest.fn()]); // vehicles
    useStateSpy.mockReturnValueOnce([false, jest.fn()]); // loading
    useStateSpy.mockReturnValueOnce(['Failed to fetch', jest.fn()]); // error

    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation((cb) => { cb(); return () => {}; }); // Allow useEffect to run

    const { getByText } = render(<VehicleListScreen navigation={mockNavigation} />);

    await waitFor(() => expect(getByText('Erro: Failed to fetch')).toBeTruthy());

    console.error = originalError;
  });
});
