import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SpeedGaugeProps {
  speed: number;
  maxSpeed?: number;
}

const GAUGE_WIDTH = 150;
const GAUGE_HEIGHT = 75;
const STROKE_WIDTH = 15;
const NEEDLE_RADIUS = 5;

export function SpeedGauge({ speed = 0, maxSpeed = 200 }: SpeedGaugeProps) {
  const clampedSpeed = Math.min(Math.max(speed, 0), maxSpeed);
  const angle = (clampedSpeed / maxSpeed) * 180; // 0 to 180 degrees

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const arc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(GAUGE_WIDTH / 2, GAUGE_HEIGHT, GAUGE_HEIGHT - STROKE_WIDTH / 2, endAngle);
    const end = polarToCartesian(GAUGE_WIDTH / 2, GAUGE_HEIGHT, GAUGE_HEIGHT - STROKE_WIDTH / 2, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${GAUGE_HEIGHT - STROKE_WIDTH / 2} ${GAUGE_HEIGHT - STROKE_WIDTH / 2} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };
  
  const progressPercentage = (clampedSpeed / maxSpeed) * 100;
  let progressColor = '#10b981'; // Green
  if (progressPercentage > 50) progressColor = '#f59e0b'; // Yellow
  if (progressPercentage > 80) progressColor = '#ef4444'; // Red


  return (
    <View style={styles.container}>
      <Svg width={GAUGE_WIDTH} height={GAUGE_HEIGHT + 10}>
        {/* Background Arc */}
        <Path
          d={arc(0, 180)}
          stroke="#e5e7eb"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {/* Progress Arc */}
        <Path
          d={arc(0, angle)}
          stroke={progressColor}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
      </Svg>
      <View style={[styles.needle, { transform: [{ rotate: `${angle - 90}deg` }] }]} testID="needle">
        <View style={styles.needleShaft} />
      </View>
      <View style={styles.needleHub} />

      <View style={styles.speedContainer}>
        <Text style={styles.speedText}>{Math.round(clampedSpeed)}</Text>
        <Text style={styles.speedUnit}>km/h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: GAUGE_WIDTH,
    height: GAUGE_HEIGHT + 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  speedContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  speedText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  speedUnit: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: -4,
  },
  needle: {
    position: 'absolute',
    width: 2,
    height: GAUGE_HEIGHT - STROKE_WIDTH,
    bottom: 10,
    left: GAUGE_WIDTH / 2 - 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  needleShaft: {
    width: 2,
    height: '90%',
    backgroundColor: '#1f2937',
    borderRadius: 1,
  },
  needleHub: {
    position: 'absolute',
    width: NEEDLE_RADIUS * 2,
    height: NEEDLE_RADIUS * 2,
    borderRadius: NEEDLE_RADIUS,
    backgroundColor: '#374151',
    bottom: 10 - NEEDLE_RADIUS,
  },
});