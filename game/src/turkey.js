// Player entity: Turkey escapee. Handles movement physics, jumping, double flapping, sliding, and hiding.

import { FIELD, PLAYER, SCORES } from './config.js';

export function createTurkey() {
  return {
    x: PLAYER.screenX,
    y: FIELD.groundY - PLAYER.standHeight,
    vx: 0,
    vy: 0,
    width: PLAYER.standWidth,
    height: PLAYER.standHeight,

    lives: PLAYER.maxLives,
    decoys: PLAYER.initialDecoys,

    isGrounded: true,
    isSliding: false,
    isHidden: false,
    slideTimer: 0,
    slideCooldown: 0,

    flapsRemaining: PLAYER.maxFlaps,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    invincibleTimer: 0,

    animFrame: 0,
    animTimer: 0,
    runPuffTimer: 0,
    squishScaleX: 1.0,
    squishScaleY: 1.0,

    reset() {
      this.x = PLAYER.screenX;
      this.y = FIELD.groundY - PLAYER.standHeight;
      this.vx = 0;
      this.vy = 0;
      this.width = PLAYER.standWidth;
      this.height = PLAYER.standHeight;
      this.lives = PLAYER.maxLives;
      this.decoys = PLAYER.initialDecoys;
      this.isGrounded = true;
      this.isSliding = false;
      this.isHidden = false;
      this.slideTimer = 0;
      this.slideCooldown = 0;
      this.flapsRemaining = PLAYER.maxFlaps;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      this.invincibleTimer = 0;
      this.animFrame = 0;
      this.animTimer = 0;
      this.squishScaleX = 1.0;
      this.squishScaleY = 1.0;
    },

    update(dt, input, audio, particles, currentHidingSpot) {
      // Manage invulnerability
      if (this.invincibleTimer > 0) {
        this.invincibleTimer -= dt;
      }

      // Check hiding availability
      if (currentHidingSpot && input.isHide()) {
        this.isHidden = true;
      } else {
        this.isHidden = false;
      }

      // Manage slide cooldown & timer
      if (this.slideCooldown > 0) {
        this.slideCooldown -= dt;
      }

      if (this.isSliding) {
        this.slideTimer -= dt;
        this.width = PLAYER.slideWidth;
        this.height = PLAYER.slideHeight;
        this.y = FIELD.groundY - PLAYER.slideHeight;

        // Dust during slide
        if (Math.random() < 0.4) {
          particles.addDust(this.x + 10, FIELD.groundY - 2, 2, -120, -40);
        }

        if (this.slideTimer <= 0) {
          this.isSliding = false;
          this.width = PLAYER.standWidth;
          this.height = PLAYER.standHeight;
          this.y = FIELD.groundY - PLAYER.standHeight;
          this.slideCooldown = PLAYER.slideCooldown;
        }
      } else if (this.isGrounded && input.wasSlideJustPressed() && this.slideCooldown <= 0) {
        this.isSliding = true;
        this.slideTimer = PLAYER.slideDuration;
        this.width = PLAYER.slideWidth;
        this.height = PLAYER.slideHeight;
        this.y = FIELD.groundY - PLAYER.slideHeight;
        audio.playSlide();
        particles.addDust(this.x + 20, FIELD.groundY - 4, 6, -180, -60);
      }

      // Ground & Coyote time
      if (this.isGrounded) {
        this.coyoteTimer = PLAYER.coyoteTime;
        this.flapsRemaining = PLAYER.maxFlaps;
      } else {
        this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
      }

      // Jump buffer
      if (input.wasJumpJustPressed()) {
        this.jumpBufferTimer = PLAYER.jumpBufferTime;
      } else {
        this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
      }

      // Execute jump or double flap
      if (this.jumpBufferTimer > 0 && !this.isSliding) {
        if (this.coyoteTimer > 0 || this.isGrounded) {
          // Standard jump
          this.vy = PLAYER.jumpSpeed;
          this.isGrounded = false;
          this.coyoteTimer = 0;
          this.jumpBufferTimer = 0;
          this.squishScaleX = 0.8;
          this.squishScaleY = 1.25;
          audio.playJump();
          particles.addDust(this.x + 30, FIELD.groundY - 2, 8, -60, 60);
        } else if (this.flapsRemaining > 0) {
          // Double flap midair
          this.vy = PLAYER.doubleFlapImpulse;
          this.flapsRemaining -= 1;
          this.jumpBufferTimer = 0;
          this.squishScaleX = 1.15;
          this.squishScaleY = 0.85;
          audio.playFlap();
          particles.addFeathers(this.x + 20, this.y + 30, 4, false);
          particles.addPopup('FLAP!', this.x + 35, this.y - 10, '#FFE082', 18, 0.7);
        }
      }

      // Variable jump height: release early cuts upward velocity
      if (!input.isJump() && this.vy < -200) {
        this.vy += 800 * dt;
      }

      // Gravity & Vertical integration
      if (!this.isGrounded) {
        this.vy += PLAYER.gravity * dt;
        this.y += this.vy * dt;

        if (this.y >= FIELD.groundY - this.height) {
          this.y = FIELD.groundY - this.height;
          this.vy = 0;
          this.isGrounded = true;
          this.squishScaleX = 1.2;
          this.squishScaleY = 0.8;
          particles.addDust(this.x + 30, FIELD.groundY - 2, 6, -80, 80);
        }
      }

      // Squish scale recovery
      this.squishScaleX += (1.0 - this.squishScaleX) * dt * 10;
      this.squishScaleY += (1.0 - this.squishScaleY) * dt * 10;

      // Animation frame updates
      this.animTimer += dt;
      if (this.animTimer > 0.08) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 4;
      }

      // Running dust puff generator
      if (this.isGrounded && !this.isSliding) {
        this.runPuffTimer += dt;
        if (this.runPuffTimer > 0.18) {
          this.runPuffTimer = 0;
          particles.addDust(this.x + 8, FIELD.groundY - 2, 2, -70, -20);
        }
      }
    },

    takeHit(audio, particles) {
      if (this.invincibleTimer > 0) return false;
      this.lives = Math.max(0, this.lives - 1);
      this.invincibleTimer = PLAYER.invincibleTime;
      audio.playHit();
      particles.addFeathers(this.x + 30, this.y + 30, 16, true);
      particles.addPopup('OUCH! -1 LIFE', this.x + 30, this.y - 20, '#FF4444', 28, 1.4);
      return true;
    },

    getHitbox() {
      // Forgiving hitbox slightly inset for fair gameplay
      const insetX = 12;
      const insetY = 8;
      return {
        x: this.x + insetX,
        y: this.y + insetY,
        width: Math.max(10, this.width - insetX * 2),
        height: Math.max(10, this.height - insetY * 2),
      };
    },
  };
}
