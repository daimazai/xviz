// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/* global console  */
/* eslint-disable no-console */
import {open, TimeUtil} from 'rosbag';

export async function BagDump(args) {
  const {bag: bagPath, topic: mainTopic} = args;

  const bag = await open(bagPath);

  if (args.dumpTime) {
    console.log(`start_time: ${TimeUtil.toDate(bag.startTime).getTime() / 1e3}`);
    console.log(`end_time: ${TimeUtil.toDate(bag.endTime).getTime() / 1e3}`);
  }

  if (args.dumpAllTopics) {
    for (const conn in bag.connections) {
      const {topic, type} = bag.connections[conn];
      console.log(topic, type);
    }
  }

  if (args.dumpMessages) {
    await bag.readMessages({}, ({topic, message}) => {
      if (!mainTopic || topic === mainTopic) {
        console.log(JSON.stringify(message, null, 2));
      }
    });
  }
}
