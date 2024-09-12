import { Component, Input } from '@angular/core';
import { Post } from '../../models/post.model';
import { apiUrls, liveUrl } from '../../api.urls';

@Component({
  selector: 'app-share-buttons',
  standalone: true,
  imports: [],
  templateUrl: './share-buttons.component.html',
  styleUrl: './share-buttons.component.css'
})
export class ShareButtonsComponent {
  @Input() post!: Post;

  shareOnWhatsApp(post: Post) {
    const url = liveUrl.PostUrl+post._id;
    const whatsappUrl = `https://wa.me/?text=%20${url}`;
    window.open(whatsappUrl, '_blank');
  }

  shareOnFacebook(post: Post) {
    const url = liveUrl.PostUrl+post._id;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, '_blank');
  }

  shareOnX(post: Post) {
    const url = liveUrl.PostUrl+post._id;
    const twitterUrl = `https://twitter.com/intent/tweet?text=&url=${url}`;
    window.open(twitterUrl, '_blank');
  }
  copyLink(post: Post) {
    const url = liveUrl.PostUrl+post._id;
    console.log("heelo");// Replace with the actual post link
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link.');
    });
  }

  // shareOnInstagram(post: Post) {
  //   // Instagram does not have a direct share URL for web, consider sharing post via URL copy or directing to Instagram.
  //   alert('Instagram sharing not supported directly. Please share manually.');
  // }
}
