const { sequelize, User, Room, Friend } = require("../models/index");
const ResponseDto = require("../dto/ResponseDto");
const axios = require("axios");
const { text } = require("express");
const qs = require("qs");

const kakao = {
    clientID: '187dfbd8517a2fdb721af0f630552827',
    clientSecret: '08NwRRAOnO5kKs8pCdYsU953VMna3A3T',
    redirectUri: 'http://localhost:3000/auth/kakao/callback'
}

module.exports = {
    getKakaoUser: async(req, res) => {
        try{
            console.log(req.body);
            const registerUser = await User.findOne({
                where: { id: req.body.userId }
            });
            if (registerUser === null) {
                const newUser = await User.create({
                    id: req.body.userId,
                    name: req.body.name,
                    email: req.body.email,
                    profilePhoto: req.body.profilePhoto,
                });
                res.status(201).send(new ResponseDto(201, "최초 로그인 성공, 계좌등록 필요"));
            }
            else {
                res.status(200).send(new ResponseDto(200, "로그인 성공"));
            }
        } catch(err) {
            console.log(err);
            res.status(500).send(new ResponseDto(500, "로그인 실패"));
        }
    },
    getMyList: async(req, res) => {
        let user;
        try{
            user = await axios({
                method:"GET",
                url:'https://kapi.kakao.com/v2/user/me',
                headers:{
                    Authorization:`Bearer ${req.body.userId}`
                }
            })
            
        }catch(err){
            console.log(err);
            res.status(500).send(new ResponseDto(500, "내 프로필 받아오기 실패"));
        }
        console.log(user);
        res.status(200).send(new ResponseDto(200, "내 프로필 받아오기 성공", user.data));
    },
    getUserList: async(req, res) => {
        let user;
        try{
            user = await axios({
                method:"GET",
                url:'https://kapi.kakao.com/v1/api/talk/friends',
                headers:{
                    Authorization:`Bearer ${req.body.userId}`
                }
            })
            
        }catch(err){
            console.log(err);
            res.status(500).send(new ResponseDto(500, "친구목록 받아오기 실패"));
        }
        console.log(user);
        res.status(200).send(new ResponseDto(200, "친구목록 받아오기 성공", user.data));

        // axios.get('https://kapi.kakao.com/api/talk/friends?Authorization=OJyVsVlbj-kmKLaYRtdkWk0YAcB9EQqjuf3kVDFXCilv1QAAAYLFny0n').then((response)=>{
        //     console.log(response);
        // }).catch((error)=>{
        //     console.log(error);
        // })
        
    },
    sendMessage: async(req, res) => {
        try{
            user = await axios({
                method:"POST",
                url:'https://kapi.kakao.com/v1/api/talk/friends/message/default/send',
                headers:{
                    Authorization:`Bearer ${req.body.userId}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: qs.stringify({
                    "receiver_uuids": [
                        "Dz4MPQs6DD0MPREjGisZIBAkEyIOOQ42BzAIWQ"
                    ],
                    template_object: {
                        object_type: text,
                        text: "저랑 김정산 친구 맺어요!",
                        link: {
                            web_url: "https://developers.kakao.com",
                            mobile_web_url: "https://developers.kakao.com"
                        },
                        button_title: "바로 확인"
                    },
                    })
            })
            console.log(req.body);
            res.status(200).send(new ResponseDto(200, "메세지 전송 성공"));
            
        }catch(err){
            console.log(err);
            res.status(500).send(new ResponseDto(500, "메세지 전송 실패"));
        }
    },
    insertFriend: async(req,res) => {
        try{
            console.log(req.body);

            if (!req.query.userId) {
                console.log(req.params);
                res.status(500).send(
                    new ResponseDto(501, "유저 아이디가 없습니다")
                );
            }
            else {
                const registerFriend = await Friend.findOne({
                    where: { id: req.body.data.id }
                });
                if (registerFriend === null) {
                    const newFriend = await Friend.create({
                        UserId: req.query.userId,
                        id: req.body.data.id,
                        name: req.body.data.profile_nickname,
                        profilePhoto: req.body.data.profile_thumbnail_image,
                    });
                    res.status(201).send(new ResponseDto(200, "친구 등록 성공"));
                }
                else {
                    res.status(200).send(new ResponseDto(501, "이미 등록되어 있는 친구입니다"));
                }
            }
            
        } catch(err) {
            console.log(err);
            res.status(500).send(new ResponseDto(500, "친구 등록 실패"));
        }
    }
}