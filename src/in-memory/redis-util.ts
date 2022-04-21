// import {User} from "../models/psql/user";
// const url = require('url');
// const redis = require("redis");

// class RedisUtil {
//
//
//     private static async connectionChecker() {
//
//         try {
//
//             let client: any = null;
//             let redisOnline = false;
//
//             let port = 6379;
//             let host = "127.0.0.1";
//             client = redis.createClient({
//                 host: host,
//                 port: port,
//                 no_ready_check: true
//             });
//
//             client.on('connect', () => {
//                 redisOnline = true;
//                 //console.log('Redis client connected');
//             });
//
//             client.on('error', (err: any) => {
//                 redisOnline = false;
//                 //console.log('Something went wrong ' + err);
//             });
//
//             return {
//                 client: client,
//                 redisOnline: redisOnline
//             }
//
//         } catch (e) {
//             console.log(e);
//             return null;
//         }
//     }
//
//     public static async getMe(userId: string) {
//
//         try {
//
//             const connection = await RedisUtil.connectionChecker();
//
//             if (!connection) {
//                 return null;
//             }
//
//             if (connection.redisOnline) {
//
//                 try {
//
//                     const dataRetrievedFromRedis = new Promise((resolve, reject) => {
//                         connection.client.get(userId, (error: any, result: any) => {
//                             if (error) {
//                                 console.log(error);
//                                 reject(error);
//                             }
//                             resolve(result);
//                         });
//                     });
//
//
//                     let result: any = await dataRetrievedFromRedis;
//
//                     if (result) {
//
//                         console.log('redis data');
//                         // console.log(result);
//
//                         return JSON.parse(result);
//                     }
//
//                 } catch (e) {
//                     console.log(e);
//                     return null;
//                 }
//             }
//
//         } catch (e) {
//             return null;
//         }
//
//     }
//
//     public static async setMe(userId: string,) {
//
//         try {
//
//             const connection = await RedisUtil.connectionChecker();
//
//             if (!connection) {
//                 return null;
//             }
//
//             if (connection.redisOnline) {
//                 try {
//
//                     const dataRetrievedFromRedis = new Promise((resolve, reject) => {
//                         connection.client.get(userId, (error: any, result: any) => {
//                             if (error) {
//                                 console.log(error);
//                                 reject(error);
//                             }
//                             resolve(result);
//                         });
//                     });
//
//
//                     let result: any = await dataRetrievedFromRedis;
//
//                     if (result) {
//
//                         console.log('redis data');
//                         // console.log(result);
//
//                         return JSON.parse(result);
//                     }
//
//                 } catch (e) {
//                     console.log(e);
//                     return null;
//                 }
//             }
//
//         } catch (e) {
//             return null;
//         }
//
//     }
//
//     public static async setUser(userId: string, user: User) {
//
//         try {
//
//             const connection = await RedisUtil.connectionChecker();
//
//             if (!connection) {
//                 return null;
//             }
//
//             if (connection.redisOnline) {
//
//                 try {
//
//                     if (connection.client) {
//                         connection.client.set(userId, JSON.stringify(user), redis.print);
//                     }
//
//                 } catch (e) {
//                     console.log(e);
//                     return null;
//                 }
//             }
//
//         } catch (e) {
//             return null;
//         }
//
//     }
// }
