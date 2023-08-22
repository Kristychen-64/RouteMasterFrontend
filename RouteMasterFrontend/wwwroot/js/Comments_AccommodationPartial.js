﻿const dec = {
    data() {
        return {
            bfVM: [],
            indexVM: [],
            item: {},
            isReplyed: "已回復",
            ep: null,
            selected: 0,         
            thumbicon: [],
            hotelId: 0,



        }
    },
    //created: function () {
    //    let _this = this;
    //},
    //mounted: function () {
    //    let _this = this;
    //    _this.commentDisplay();
    //},
    methods: {
        showAll: function () {
            let _this = this;
            _this.commentDisplay();
        },
        commentBrief: function (id) {
            var request = {};
            let _this = this;
            if (id) {
                _this.hotelId = id;
            }
            request.Manner = _this.selected;
            request.HotelId = _this.hotelId;

            axios.post("https://localhost:7145/Comments_Accommodation/Index", request).then(response => {
                _this.bfVM = response.data;
                console.log(_this.bfVM);
            }

            ).catch(err => {
                alert(err);
            });

        },
        commentDisplay: function (id) {
            let _this = this;
            var request = {};
            if (id) {
                _this.hotelId = id;
            }
            request.Manner = _this.selected;
            request.HotelId = _this.hotelId;

            axios.post("https://localhost:7145/Comments_Accommodation/ImgSearch", request).then(response => {
                _this.indexVM = response.data;
                console.log(_this.indexVM);
                _this.thumbicon = _this.indexVM.map(function (vm) {
                    
                    return vm.thumbsUp ? '<i class="fa-solid fa-thumbs-up fa-lg"></i>' : '<i class="fa-regular fa-thumbs-up fa-lg"></i>';
                })
                

                for (let j = 0; j < _this.indexVM.length; j++) {
                    _this.item = _this.indexVM[j];
                }

            }).catch(err => {
                alert(err);
            });
        },       
        likeComment: async function (commentId) {
            let _this = this;
            var request = {};
            request.CommentId = commentId;
            request.IsLike = true;

            await axios.post("https://localhost:7145/Comments_Accommodation/DecideLike", request).then(response => {

                _this.commentDisplay();

            }).catch(err => {
                alert(err);
            });

        },
        getImgPath: function (photo) {
            return `../MemberUploads/${photo}`;
        }
    },
    template: 
    `<div class="row row-cols-3 g-2 mt-2" id="brief">
            <div v-for="(text, num) in bfVM" :key="num" class="col">
                <div class="card overflow-auto" style="max-height: 180px;">
                    <div class="card-body">
                        <h5 class="card-title">{{text.account}}</h5>
                        <div class="d-flex">
                            <p class="card-text me-auto">{{text.title}}</p>
                            <p class="card-text">{{text.score}}分</p>
                        </div>
                        
                        <p class="card-text" v-if="text.pros">{{"優點:" + text.pros}}</p>
                        <p class="card-text" v-if="text.cons">{{"缺點:" +text.cons}}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <a data-bs-toggle="collapse" href="#collapseSW" role="button" aria-expanded="false" aria-controls="collapseSW" id="colla" @click="showAll">
            顯示更多
        </a>
        <div class="collapse" id="collapseSW">
            <div class="row mb-2">
                <div class="col-3">
                    <select v-model="selected" id="commentOrder" @change="commentDisplay">
                        <option value="0" selected>排序選擇</option>
                        <option value="1">最新留言</option>
                        <option value="2">星星評分高至低</option>
                        <option value="3">星星評分低至高</option>
                    </select>
                </div>
                <div class="col-3 ms-auto text-end">
                    <a asp-controller="Comments_Accommodation" asp-action="Create" asp-route-id="hotelId">撰寫評論</a>
                </div>
            </div>
            <div v-for="(item, index) in indexVM" :key="index" class="card mb-3 overflow-auto" style="max-height:350px;">
                <div class="row g-0">
                    <div class="col-md-8">
                        <div class="card-header">{{item.account}}</div>
                        <div class="card-body">
                            <div class="d-flex">
                                <h4 class="card-title me-auto">標題: {{item.title}}</h4>
                                <div>{{item.score}}<i class="fa fa-star fa-fw" style="color:#f90;"></i></div>
                            </div>
                            <p class="card-text" v-if="item.pros">{{"優點:" + item.pros}}</p>
                            <p class="card-text" v-if="item.cons">{{"缺點:" + item.cons}}</p>

                            <div class="d-flex mt-2">
                                <button type="button" v-html="thumbicon[index]" @click="likeComment(item.id)" class="btn btn-outline-dark me-3" data-bs-toggle="tooltip" data-bs-placement="top" title="按讚">
                                </button>
                                <p class="card-text me-auto"> {{item.totalThumbs}}</p>
                                <p><small class="text-muted">{{item.createDate}}</small></p>
                            </div>

                            <hr />
                            <template v-if="item.status===isReplyed">
                                <button type="button" class="btn btn-primary position-relative" data-bs-toggle="collapse"
                                        :data-bs-target='"#collapseMsg"+index' @showReply(item.id)>
                                    看回覆訊息
                                </button>
                                <div class="collapse mt-3" :id='"collapseMsg" + index'>
                                    <div class="card card-body">
                                        <h5>來自{{item.hotelName}}的回覆:</h5>
                                        <p>{{item.replyMessage}}</p>
                                        <p class="card-text text-end"><small class="text-muted">{{item.replyDate}}</small></p>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <template v-if="item.imageList.length>1">
                            <div :id='"carousel" + index' class="carousel carousel-dark slide" data-bs-ride="carousel">
                                <div class="carousel-inner w-100 mx-auto my-auto">
                                    <div :class="{ 'carousel-item': true, 'active': num === 0 }" v-for="(photo,num) in item.imageList" :key="num">
                                        <img v-bind:src="getImgPath(photo)" class="d-block w-100">
                                    </div>

                                </div>
                                <button class="carousel-control-prev" type="button" :data-bs-target='"#carousel"+ index' data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button" :data-bs-target='"#carousel"+ index' data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Next</span>
                                </button>
                            </div>
                        </template>
                        <template v-else-if="item.imageList.length===1">
                            <img v-bind:src="getImgPath(item.imageList[0])" class="img-fluid rounded-start">
                        </template>
                        <template v-else>
                            <img src="../MemberUploads/RouteMaster.png" class="img-fluid rounded-start">
                        </template>
                    </div>
                </div>
            </div>
        </div>
    `
       


};
