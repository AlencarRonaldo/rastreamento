import React from 'react';
import { render } from '@testing-library/react-native';
import { SpeedGauge } from './SpeedGauge';

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  const MockSvg = (props: any) => <View {...props} />;
  const MockPath = (props: any) => <View testID="path" {...props} />;
  return {
    __esModule: true,
    default: MockSvg,
    Path: MockPath,
  };
});

describe('SpeedGauge', () => {
  it('renders the speed and unit correctly', () => {
    const { getByText } = render(<SpeedGauge speed={88} />);
    expect(getByText('88')).toBeTruthy();
    expect(getByText('km/h')).toBeTruthy();
  });

  it('clamps the speed to 0 if negative', () => {
    const { getByText } = render(<SpeedGauge speed={-20} />);
    expect(getByText('0')).toBeTruthy();
  });

  it('clamps the speed to maxSpeed if exceeded', () => {
    const { getByText } = render(<SpeedGauge speed={250} maxSpeed={200} />);
    expect(getByText('200')).toBeTruthy();
  });

  it('renders two path components for the gauge arc', () => {
    const { getAllByTestId } = render(<SpeedGauge speed={100} />);
    const paths = getAllByTestId('path');
    expect(paths.length).toBe(2);
  });
  
  it('calculates the needle rotation correctly', () => {
    const { getByTestId } = render(<SpeedGauge speed={100} maxSpeed={200} />);
    const needle = getByTestId('needle');
    const style = needle.props.style.find((s: any) => s.transform);
    // angle = (100 / 200) * 180 = 90. rotate = 90 - 90 = 0
    expect(style.transform[0].rotate).toBe('0deg');
  });
});
