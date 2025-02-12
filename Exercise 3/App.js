import React,{useState, useEffect} from 'react';
import {StatusBar, Button, StyleSheet, Text, View} from 'react-native';
import {Audio} from 'expo-av';
import { Accelerometer } from 'expo-sensors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
    },
});


export default function App() {

    const [{x, y, z}, setData] = useState({x:0, y:0, z:0});
    const[myShake, setMyShake] = useState(false);
    const [mySound, setMySound] = useState();

    async function playSound() {
        const soundfile = require('./maracas_shake.wav');
        const {sound} = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        Accelerometer.setUpdateInterval(100);
        const subscription = Accelerometer.addListener((data) => {
            setData(data);

            const acceleration = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
            if (acceleration > 1.5) {
                setMyShake(true);
                playSound();
            } else {
                setMyShake(false);
            }
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        return mySound
            ? () => {
                console.log('Unloading Sound');
                mySound.unloadAsync();
            }
            : undefined;
    },[mySound]);
    return (
        <View>
            <StatusBar />
            {myShake && <Text style={styles.text}>SHAKE</Text>}
        </View>
    );
}


