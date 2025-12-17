import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Users, BookOpen, Sparkles } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Discernment",
      description:
        "We provide careful, biblically-grounded analysis to help you make wise media choices.",
    },
    {
      icon: BookOpen,
      title: "Clarity",
      description:
        "Clear, understandable guidance rooted in Scripture and Christian principles.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description:
        "Honest assessments that honor both truth and grace in every analysis.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description:
        "Combining AI technology with timeless biblical wisdom for modern media.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building a community of believers who seek to honor God in their entertainment choices.",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="section-spacing-large">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Our Mission
            </h1>
            <p className="body-large text-muted-foreground">
              Empowering Christians to make discerning entertainment choices
              through AI-powered analysis and biblical wisdom.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-spacing bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="rounded-2xl border-2">
              <CardContent className="card-padding-large pt-6 md:pt-8">
                <blockquote className="body-large font-serif italic text-center content-spacing">
                  <p>
                    "Finally, brothers and sisters, whatever is true, whatever is
                    noble, whatever is right, whatever is pure, whatever is
                    lovely, whatever is admirable—if anything is excellent or
                    praiseworthy—think about such things."
                  </p>
                  <footer className="text-base font-medium text-muted-foreground not-italic">
                    — Philippians 4:8 (NLT)
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-spacing">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-6xl mx-auto space-y-12"
          >
            <div className="text-center content-spacing">
              <h2 className="heading-1">
                Our Core Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do at SanctifAi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  data-testid={`value-card-${index}`}
                >
                  <Card className="rounded-2xl border-2 h-full hover-elevate transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <CardContent className="card-padding flex flex-col pt-6 md:pt-8">
                      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="heading-3 mt-4">
                        {value.title}
                      </h3>
                      <p className="body-small text-muted-foreground mt-2">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="text-center content-spacing">
              <h2 className="heading-1">
                How SanctifAi Works
              </h2>
              <p className="text-muted-foreground">
                Combining technology with timeless biblical principles
              </p>
            </div>

            <div className="space-y-6">
              <Card className="rounded-2xl border-2">
                <CardContent className="card-padding content-spacing pt-6 md:pt-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold leading-none">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-3 mb-2">
                        Search for Content
                      </h3>
                      <p className="body-small text-muted-foreground">
                        Enter any movie, TV show, book, or song title you're
                        considering.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-2">
                <CardContent className="card-padding content-spacing pt-6 md:pt-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold leading-none">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-3 mb-2">
                        Ai-Powered Analysis
                      </h3>
                      <p className="body-small text-muted-foreground">
                        Our AI evaluates the content against Christian values and
                        biblical principles, generating a comprehensive discernment
                        score.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-2">
                <CardContent className="card-padding content-spacing pt-6 md:pt-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold leading-none">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-3 mb-2">
                        Scripture-Guided Wisdom
                      </h3>
                      <p className="body-small text-muted-foreground">
                        Receive relevant Bible verses (NLT) that provide spiritual
                        context and guidance related to the content's themes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-2">
                <CardContent className="card-padding content-spacing pt-6 md:pt-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold leading-none">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-3 mb-2">
                        Discover Alternatives
                      </h3>
                      <p className="body-small text-muted-foreground">
                        Get three faith-safe alternative recommendations with
                        clear reasons for each suggestion.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section-spacing">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="rounded-2xl border-2 bg-muted/20">
              <CardContent className="card-padding content-spacing pt-6 md:pt-8">
                <h3 className="heading-3">A Note on Discernment</h3>
                <p className="body-small text-muted-foreground">
                  SanctifAi is a tool to assist in your media choices, but it
                  should not replace personal prayer, biblical study, and the
                  guidance of the Holy Spirit. We encourage you to seek God's
                  wisdom and consult with your faith community when making
                  entertainment decisions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
