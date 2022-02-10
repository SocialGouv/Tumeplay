import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import AppContext from '../../../AppContext';
import BadgesSkeleton from '../global/SkeletonDesign/BadgesSkeleton';
import Badge from './Badge';
import JourneyTopInformation from './JourneyTopInformation';

const WrapperLevelBadges = ({level, associatedModules, loading}) => {
  const {doneModules_ids, user} = useContext(AppContext);

  const modulesToDisplay = associatedModules?.map(module => {
    if (module.module_index < doneModules_ids.length) {
      module.status = 'done';
    } else if (module.module_index === doneModules_ids.length) {
      module.status = 'todo';
    } else {
      module.status = 'locked';
    }
    return (
      <Badge
        key={module.id}
        module={module}
        module_index={module.module_index}
        status={module.status}
      />
    );
  });

  //use to generate a fake line for skeleton design
  const array = [0, 1, 2, 3];

  const skeletonBadges = array.map((_, index) => (
    <BadgesSkeleton key={index} />
  ));

  return (
    <View style={styles.container}>
      <JourneyTopInformation level={level} />
      <View style={styles.badgeWrapper}>
        {loading ? skeletonBadges : modulesToDisplay}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: '100%',
  },
  badgeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default WrapperLevelBadges;
