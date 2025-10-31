const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const listingSchema =new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://www.google.com/imgres?q=image%20of%20hotel&imgurl=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F472899538%2Fphoto%2Fdowntown-cleveland-hotel-entrance-and-waiting-taxi-cab.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3Drz-WSe_6gKfkID6EL9yxCdN_UIMkXUBsr67884j-X9o%3D&imgrefurl=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fhotel-entrance&docid=TOK3yfJcPYM19M&tbnid=3FZVsIOHBsUNpM&vet=12ahUKEwiz-fC4hM2QAxXoT2wGHQyVNjoQM3oECBkQAA..i&w=612&h=408&hcb=2&ved=2ahUKEwiz-fC4hM2QAxXoT2wGHQyVNjoQM3oECBkQAA",
        set:(v) => v ==="" ? "https://www.google.com/imgres?q=image%20of%20hotel&imgurl=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F472899538%2Fphoto%2Fdowntown-cleveland-hotel-entrance-and-waiting-taxi-cab.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3Drz-WSe_6gKfkID6EL9yxCdN_UIMkXUBsr67884j-X9o%3D&imgrefurl=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fhotel-entrance&docid=TOK3yfJcPYM19M&tbnid=3FZVsIOHBsUNpM&vet=12ahUKEwiz-fC4hM2QAxXoT2wGHQyVNjoQM3oECBkQAA..i&w=612&h=408&hcb=2&ved=2ahUKEwiz-fC4hM2QAxXoT2wGHQyVNjoQM3oECBkQAA":v,
    },
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports =Listing;